import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZakatAsset } from './entities/zakat-asset.entity';
import { Sadaqah } from './entities/sadaqah.entity';
import { HawlCycle } from './entities/hawl-cycle.entity';
import { User } from '../users/entities/user.entity';
import { 
  ZakatAssetType, 
  HawlCycleStatus, 
  ZakatSummary, 
  AddZakatAssetRequest, 
  LogSadaqahRequest,
  Madhab,
  Dialect
} from '@tariq/shared';
import moment from 'moment-hijri';
import { GroqService } from '../ai/groq.service';

@Injectable()
export class ZakatService {
  private readonly logger = new Logger(ZakatService.name);

  // Constants for Nisab
  private readonly GOLD_NISAB_GRAMS = 85;
  private readonly SILVER_NISAB_GRAMS = 595;
  
  // Mock prices - in a real app, these would come from an API
  private readonly GOLD_PRICE_PER_GRAM = 65; 
  private readonly SILVER_PRICE_PER_GRAM = 0.8;

  constructor(
    @InjectRepository(ZakatAsset)
    private readonly assetRepository: Repository<ZakatAsset>,
    @InjectRepository(Sadaqah)
    private readonly sadaqahRepository: Repository<Sadaqah>,
    @InjectRepository(HawlCycle)
    private readonly hawlRepository: Repository<HawlCycle>,
    private readonly groqService: GroqService,
  ) {}

  async getSummary(userId: string): Promise<ZakatSummary> {
    const assets = await this.assetRepository.find({ where: { userId } });
    const totalAssets = assets.reduce((sum, asset) => sum + Number(asset.value), 0);

    const nisabGold = this.GOLD_NISAB_GRAMS * this.GOLD_PRICE_PER_GRAM;
    const nisabSilver = this.SILVER_NISAB_GRAMS * this.SILVER_PRICE_PER_GRAM;

    // Use Silver Nisab as it's usually lower and more beneficial for the poor (common fatwa)
    // but some madhabs/people prefer Gold. We'll use Silver for isNisabReached.
    const isNisabReached = totalAssets >= nisabSilver;
    const zakatDue = isNisabReached ? totalAssets * 0.025 : 0;

    const activeCycle = await this.getActiveHawlCycle(userId);
    let hawlDaysRemaining = 0;
    if (activeCycle) {
      const end = moment(activeCycle.endDate, 'YYYY-MM-DD');
      const now = moment();
      hawlDaysRemaining = Math.max(0, end.diff(now, 'days'));
    }

    const startOfYear = moment().startOf('year').format('YYYY-MM-DD');
    const sadaqahThisYear = await this.sadaqahRepository
      .createQueryBuilder('sadaqah')
      .where('sadaqah.userId = :userId', { userId })
      .andWhere('sadaqah.date >= :startOfYear', { startOfYear })
      .select('SUM(sadaqah.amount)', 'total')
      .getRawOne();

    return {
      totalAssets,
      zakatDue,
      nisabGold,
      nisabSilver,
      isNisabReached,
      hawlDaysRemaining,
      totalSadaqahYear: Number(sadaqahThisYear?.total || 0),
    };
  }

  async addAsset(userId: string, data: AddZakatAssetRequest): Promise<ZakatAsset> {
    const asset = this.assetRepository.create({
      userId,
      ...data,
    });
    const saved = await this.assetRepository.save(asset);
    await this.updateHawlCycle(userId);
    return saved;
  }

  async logSadaqah(userId: string, data: LogSadaqahRequest): Promise<Sadaqah> {
    const sadaqah = this.sadaqahRepository.create({
      userId,
      ...data,
    });
    return this.sadaqahRepository.save(sadaqah);
  }

  private async getActiveHawlCycle(userId: string): Promise<HawlCycle | null> {
    return this.hawlRepository.findOne({
      where: { userId, status: HawlCycleStatus.ACTIVE },
    });
  }

  private async updateHawlCycle(userId: string) {
    const assets = await this.assetRepository.find({ where: { userId } });
    const totalWealth = assets.reduce((sum, asset) => sum + Number(asset.value), 0);
    const nisabSilver = this.SILVER_NISAB_GRAMS * this.SILVER_PRICE_PER_GRAM;

    let activeCycle = await this.getActiveHawlCycle(userId);

    if (totalWealth >= nisabSilver) {
      if (!activeCycle) {
        // Start new cycle
        const startDate = moment().format('YYYY-MM-DD');
        const endDate = moment().add(354, 'days').format('YYYY-MM-DD'); // Hijri year is ~354 days
        activeCycle = this.hawlRepository.create({
          userId,
          startDate,
          endDate,
          initialWealth: totalWealth,
          currentWealth: totalWealth,
          status: HawlCycleStatus.ACTIVE,
        });
        await this.hawlRepository.save(activeCycle);
      } else {
        // Update current wealth
        activeCycle.currentWealth = totalWealth;
        await this.hawlRepository.save(activeCycle);
      }
    } else {
      // If wealth falls below nisab, the cycle is broken in many madhabs
      // For simplicity, we'll mark it as completed or just delete it if it hasn't finished
      if (activeCycle) {
        activeCycle.status = HawlCycleStatus.COMPLETED; // Or broken
        await this.hawlRepository.save(activeCycle);
      }
    }
  }

  async askZakatAi(query: string, user: User) {
    const systemPrompt = this.getZakatAiPrompt(user.madhab, user.dialect);
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ];

    return this.groqService.getChatCompletionStream(messages);
  }

  private getZakatAiPrompt(madhab: Madhab, dialect: Dialect): string {
    const madhabName = {
      [Madhab.HANAFI]: 'الحنفي',
      [Madhab.MALIKI]: 'المالكي',
      [Madhab.SHAFI_I]: 'الشافعي',
      [Madhab.HANBALI]: 'الحنبلي',
    }[madhab];

    const dialectName = {
      [Dialect.TUNISIAN]: 'اللهجة التونسية',
      [Dialect.EGYPTIAN]: 'اللهجة المصرية',
      [Dialect.GULF]: 'اللهجة الخليجية',
      [Dialect.MOROCCAN]: 'اللهجة المغربية',
    }[dialect];

    return `أنت خبير في فقه الزكاة والصدقات. مهمتك هي مساعدة المستخدمين في حساب زكاتهم والإجابة على تساؤلاتهم المالية بناءً على الفقه الإسلامي.
يجب أن تتبع في فتاواك المذهب ${madhabName}.
يجب أن تتحدث مع المستخدم ب${dialectName}.
اجعل إجابتك دقيقة، سهلة الفهم، ومستندة إلى المصادر المعتبرة.
ركز على المسائل الحديثة مثل زكاة الأسهم، العملات الرقمية، الحسابات البنكية، والتجارة الإلكترونية.
إذا كان هناك اختلاف داخل المذهب، فاذكر القول الراجح.
ذكّر المستخدم دائماً بأن الزكاة طهارة للمال ونماء للرزق.`;
  }
}

import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuranGoal } from './entities/quran-goal.entity';
import { QuranProgress } from './entities/quran-progress.entity';
import { QuranReflection } from './entities/quran-reflection.entity';
import { Khatm } from './entities/khatm.entity';
import { KhatmPart } from './entities/khatm-part.entity';
import { GroqService } from '../ai/groq.service';
import { CreateQuranGoalRequest, LogQuranProgressRequest, QuranStreak, CreateKhatmRequest } from '@tariq/shared';

@Injectable()
export class QuranService {
  constructor(
    @InjectRepository(QuranGoal)
    private goalRepository: Repository<QuranGoal>,
    @InjectRepository(QuranProgress)
    private progressRepository: Repository<QuranProgress>,
    @InjectRepository(QuranReflection)
    private reflectionRepository: Repository<QuranReflection>,
    @InjectRepository(Khatm)
    private khatmRepository: Repository<Khatm>,
    @InjectRepository(KhatmPart)
    private khatmPartRepository: Repository<KhatmPart>,
    private groqService: GroqService,
  ) {}

  async createKhatm(circleId: string, data: CreateKhatmRequest): Promise<Khatm> {
    const khatm = this.khatmRepository.create({
      circleId,
      title: data.title,
      description: data.description,
      parts: Array.from({ length: 30 }, (_, i) => ({
        juzNumber: i + 1,
      })),
    });
    return this.khatmRepository.save(khatm);
  }

  async getKhatms(circleId: string): Promise<Khatm[]> {
    return this.khatmRepository.find({
      where: { circleId },
      relations: ['parts', 'parts.claimedByUser'],
      order: { createdAt: 'DESC' },
    });
  }

  async claimKhatmPart(userId: string, khatmId: string, juzNumber: number): Promise<KhatmPart> {
    const part = await this.khatmPartRepository.findOne({
      where: { khatmId, juzNumber },
    });

    if (!part) {
      throw new NotFoundException('Khatm part not found');
    }

    if (part.claimedByUserId && part.claimedByUserId !== userId) {
      throw new ConflictException('This part is already claimed by someone else');
    }

    part.claimedByUserId = userId;
    return this.khatmPartRepository.save(part);
  }

  async markKhatmPartComplete(userId: string, khatmId: string, juzNumber: number): Promise<KhatmPart> {
    const part = await this.khatmPartRepository.findOne({
      where: { khatmId, juzNumber },
    });

    if (!part) {
      throw new NotFoundException('Khatm part not found');
    }

    if (part.claimedByUserId !== userId) {
      throw new ForbiddenException('You can only complete parts you have claimed');
    }

    part.isCompleted = true;
    part.completedAt = new Date();
    
    const savedPart = await this.khatmPartRepository.save(part);

    // Check if all parts are completed
    const remainingParts = await this.khatmPartRepository.count({
      where: { khatmId, isCompleted: false },
    });

    if (remainingParts === 0) {
      await this.khatmRepository.update(khatmId, { isCompleted: true, endDate: new Date() });
    }

    return savedPart;
  }

  async createGoal(userId: string, data: CreateQuranGoalRequest): Promise<QuranGoal> {
    const goal = this.goalRepository.create({
      userId,
      ...data,
      startDate: data.endDate ? new Date() : new Date(), // Handle dates properly if needed
      isActive: true,
    });
    return this.goalRepository.save(goal);
  }

  async getGoals(userId: string): Promise<QuranGoal[]> {
    return this.goalRepository.find({
      where: { userId, isActive: true },
      order: { createdAt: 'DESC' },
    });
  }

  async logProgress(userId: string, data: LogQuranProgressRequest): Promise<QuranProgress> {
    const progress = this.progressRepository.create({
      userId,
      ...data,
    });
    const savedProgress = await this.progressRepository.save(progress);

    // Generate AI reflection in the background
    this.generateReflection(userId, savedProgress).catch(err => 
      console.error('Failed to generate reflection:', err)
    );

    return savedProgress;
  }

  async getProgress(userId: string): Promise<QuranProgress[]> {
    return this.progressRepository.find({
      where: { userId },
      order: { date: 'DESC', createdAt: 'DESC' },
      take: 20,
    });
  }

  async getStreak(userId: string): Promise<QuranStreak> {
    const completions = await this.progressRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });

    if (completions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const uniqueDates = Array.from(new Set(completions.map(c => c.date))).sort((a, b) => b.localeCompare(a));
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    const latestDate = uniqueDates[0];

    if (latestDate === today || latestDate === yesterday) {
      let checkDate = new Date(latestDate);
      for (const date of uniqueDates) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (date === dateStr) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    const sortedAsc = [...uniqueDates].sort((a, b) => a.localeCompare(b));

    for (const date of sortedAsc) {
        const currentDate = new Date(date);
        if (prevDate) {
            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        prevDate = currentDate;
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }
    }

    return {
      currentStreak,
      longestStreak,
      lastReadingDate: latestDate,
    };
  }

  async generateReflection(userId: string, progress: QuranProgress): Promise<QuranReflection | null> {
    const systemPrompt = `You are an Islamic scholar providing spiritual reflections based on Quranic verses read by a user.
    The user just read Surah ${progress.surahNumber}, Ayahs ${progress.ayahStart} to ${progress.ayahEnd}.
    Provide a brief, spiritually uplifting reflection in Arabic that connects these verses to daily life and spiritual growth.
    Keep it concise and inspiring.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Please provide a reflection on my recent reading: Surah ${progress.surahNumber}, Ayahs ${progress.ayahStart}-${progress.ayahEnd}.` },
    ];

    try {
      const completion = await this.groqService.getChatCompletion(messages);
      const content = completion.choices[0].message.content;

      const reflection = this.reflectionRepository.create({
        userId,
        progressId: progress.id,
        content,
        verseContext: `Surah ${progress.surahNumber}, Ayahs ${progress.ayahStart}-${progress.ayahEnd}`,
      });

      return await this.reflectionRepository.save(reflection);
    } catch (error) {
      console.error('Error generating AI reflection:', error);
      return null;
    }
  }

  async getReflections(userId: string): Promise<QuranReflection[]> {
    return this.reflectionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 10,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AthkarCategory, AthkarCategoryEnum } from './entities/athkar-category.entity';
import { AthkarItem } from './entities/athkar-item.entity';
import { AthkarCompletion } from './entities/athkar-completion.entity';
import { ATHKAR_CATEGORY_NAMES_AR, ATHKAR_CATEGORY_NAMES_EN, LogAthkarCompletionRequest } from '@tariq/shared';

@Injectable()
export class AthkarService {
  constructor(
    @InjectRepository(AthkarCategory)
    private athkarCategoryRepository: Repository<AthkarCategory>,
    @InjectRepository(AthkarItem)
    private athkarItemRepository: Repository<AthkarItem>,
    @InjectRepository(AthkarCompletion)
    private athkarCompletionRepository: Repository<AthkarCompletion>,
  ) {}

  async logCompletion(userId: string, request: LogAthkarCompletionRequest) {
    const completion = this.athkarCompletionRepository.create({
      userId,
      ...request,
    });
    return this.athkarCompletionRepository.save(completion);
  }

  async getCategories() {
    const categories = await this.athkarCategoryRepository.find({
      relations: ['items'],
      order: { id: 'ASC' },
    });

    return categories.map((cat) => ({
      id: cat.id,
      category: cat.category,
      nameAr: cat.nameAr,
      nameEn: cat.nameEn,
      icon: cat.icon,
      itemCount: cat.items?.length || 0,
    }));
  }

  async getByCategory(category: string) {
    const athkarCategory = await this.athkarCategoryRepository.findOne({
      where: { category: category as AthkarCategoryEnum },
      relations: ['items'],
    });

    if (!athkarCategory) {
      return {
        category,
        nameAr: ATHKAR_CATEGORY_NAMES_AR[category as keyof typeof ATHKAR_CATEGORY_NAMES_AR] || category,
        nameEn: ATHKAR_CATEGORY_NAMES_EN[category as keyof typeof ATHKAR_CATEGORY_NAMES_EN] || category,
        items: [],
      };
    }

    return {
      category: athkarCategory.category,
      nameAr: athkarCategory.nameAr,
      nameEn: athkarCategory.nameEn,
      items: athkarCategory.items.sort((a, b) => a.order - b.order),
    };
  }

  async getAllAthkar() {
    const categories = await this.athkarCategoryRepository.find({
      relations: ['items'],
    });

    return categories.map((cat) => ({
      category: cat.category,
      nameAr: cat.nameAr,
      nameEn: cat.nameEn,
      items: cat.items.sort((a, b) => a.order - b.order),
    }));
  }

  async getRandomAthkar(category: string) {
    const item = await this.athkarItemRepository
      .createQueryBuilder('item')
      .innerJoin('item.category', 'category')
      .where('category.category = :category', { category })
      .orderBy('RANDOM()')
      .getOne();

    if (!item) {
      return null;
    }

    return item;
  }

  async seedCategories() {
    const categories = [
      { category: AthkarCategoryEnum.MORNING, nameAr: 'أذكار الصباح', nameEn: 'Morning Athkar', icon: 'sun' },
      { category: AthkarCategoryEnum.EVENING, nameAr: 'أذكار المساء', nameEn: 'Evening Athkar', icon: 'moon' },
      { category: AthkarCategoryEnum.SLEEP, nameAr: 'أذكار النوم', nameEn: 'Sleep Athkar', icon: 'bed' },
      { category: AthkarCategoryEnum.WAKE_UP, nameAr: 'أذكار الاستيقاظ', nameEn: 'Wake Up Athkar', icon: 'alarm' },
      { category: AthkarCategoryEnum.PRAYER, nameAr: 'أذكار الصلاة', nameEn: 'Prayer Athkar', icon: 'pray' },
      { category: AthkarCategoryEnum.QURAN, nameAr: 'أذكار القرآن', nameEn: 'Quran Athkar', icon: 'book' },
    ];

    for (const cat of categories) {
      const exists = await this.athkarCategoryRepository.findOne({
        where: { category: cat.category },
      });

      if (!exists) {
        await this.athkarCategoryRepository.save(this.athkarCategoryRepository.create(cat));
      }
    }
  }
}

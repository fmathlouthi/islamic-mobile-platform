import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Dream } from './entities/dream.entity';
import { CreateDreamRequest } from '@tariq/shared';
import { GroqService } from '../ai/groq.service';

@Injectable()
export class DreamsService {
  constructor(
    @InjectRepository(Dream)
    private dreamsRepository: Repository<Dream>,
    private groqService: GroqService,
  ) {}

  async create(userId: string, request: CreateDreamRequest): Promise<Dream> {
    const dream = this.dreamsRepository.create({
      ...request,
      userId,
    });
    return this.dreamsRepository.save(dream);
  }

  async findAll(userId: string): Promise<Dream[]> {
    return this.dreamsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(userId: string, id: string): Promise<Dream> {
    const dream = await this.dreamsRepository.findOne({
      where: { id, userId },
    });
    if (!dream) {
      throw new NotFoundException('Dream not found');
    }
    return dream;
  }

  async interpret(userId: string, id: string): Promise<Dream> {
    const dream = await this.findOne(userId, id);
    
    const systemPrompt = `You are an expert in Islamic dream interpretation (Tafsir al-Ahlam), following the traditions of Ibn Sirin and the Quran and Sunnah. Provide meaningful insights while reminding the user that only Allah knows the unseen. Respond in the same language as the dream description (Arabic or English).`;
    
    const userPrompt = `Dream Title: ${dream.title}\nDream Description: ${dream.description}\nMood: ${dream.mood}`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const aiResponse = await this.groqService.getChatCompletion(messages);
    const interpretation = aiResponse.choices[0].message.content;

    dream.interpretation = interpretation;
    return this.dreamsRepository.save(dream);
  }

  async delete(userId: string, id: string): Promise<void> {
    const result = await this.dreamsRepository.delete({ id, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Dream not found');
    }
  }
}

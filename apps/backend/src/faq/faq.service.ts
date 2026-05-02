import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Faq } from './faq.entity';
import { EmbeddingsService } from '../ai/embeddings.service';

@Injectable()
export class FaqService implements OnModuleInit {
  constructor(
    @InjectRepository(Faq)
    private faqRepository: Repository<Faq>,
    private embeddingsService: EmbeddingsService,
    private dataSource: DataSource,
  ) {}

  async onModuleInit() {
    await this.dataSource.query('CREATE EXTENSION IF NOT EXISTS vector');
  }

  async searchSimilar(queryEmbedding: number[], limit = 3): Promise<Faq[]> {
    const embeddingString = `[${queryEmbedding.join(',')}]`;
    
    return this.faqRepository
      .createQueryBuilder('faq')
      .orderBy('faq.embedding <=> :embedding', 'ASC')
      .setParameters({ embedding: embeddingString })
      .limit(limit)
      .getMany();
  }

  async createFaq(question: string, answer: string, metadata?: any) {
    const embedding = await this.embeddingsService.generateEmbedding(`${question} ${answer}`);
    const faq = this.faqRepository.create({
      question,
      answer,
      metadata,
      embedding,
    });
    return this.faqRepository.save(faq);
  }

  async getFallbackFaqs(limit = 3): Promise<Faq[]> {
    return this.faqRepository.find({
      order: { updatedAt: 'DESC' },
      take: limit,
    });
  }
}

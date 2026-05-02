import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import OpenAI from 'openai';

@Injectable()
export class EmbeddingsService {
  private openai: OpenAI;

  constructor(private configService: AppConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.openaiApiKey,
    });
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    });

    return response.data[0].embedding;
  }
}

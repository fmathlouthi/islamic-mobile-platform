import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { GroqService } from './groq.service';
import { EmbeddingsService } from './embeddings.service';

@Module({
  imports: [ConfigModule],
  providers: [GroqService, EmbeddingsService],
  exports: [GroqService, EmbeddingsService],
})
export class AiModule {}

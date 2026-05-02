import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './faq.entity';
import { FaqService } from './faq.service';
import { ChatService } from './chat.service';
import { FaqController } from './faq.controller';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Faq]),
    AiModule,
  ],
  providers: [FaqService, ChatService],
  controllers: [FaqController],
  exports: [FaqService],
})
export class FaqModule {}

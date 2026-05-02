import { Controller, Post, Body, Get } from '@nestjs/common';
import { ChatService } from './chat.service';
import { FaqService } from './faq.service';

@Controller('faq')
export class FaqController {
  constructor(
    private chatService: ChatService,
    private faqService: FaqService,
  ) {}

  @Post('chat')
  async chat(@Body('query') query: string) {
    return this.chatService.getAnswer(query);
  }

  // Optional: Endpoint to seed FAQ
  @Post('seed')
  async seed(@Body() faqs: { question: string, answer: string }[]) {
    const results = [];
    for (const faq of faqs) {
      results.push(await this.faqService.createFaq(faq.question, faq.answer));
    }
    return results;
  }
}

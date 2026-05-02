import { Injectable } from '@nestjs/common';
import { FaqService } from './faq.service';
import { GroqService } from '../ai/groq.service';
import { EmbeddingsService } from '../ai/embeddings.service';

@Injectable()
export class ChatService {
  constructor(
    private faqService: FaqService,
    private groqService: GroqService,
    private embeddingsService: EmbeddingsService,
  ) {}

  async getAnswer(query: string) {
    let relevantFaqs = [];
    try {
      // 1. Generate embedding for user query
      const queryEmbedding = await this.embeddingsService.generateEmbedding(query);
      // 2. Search for relevant context from FAQ
      relevantFaqs = await this.faqService.searchSimilar(queryEmbedding, 3);
    } catch {
      // If embeddings API is unavailable/quota-limited, fall back to recent FAQs.
      relevantFaqs = await this.faqService.getFallbackFaqs(3);
    }
    
    const context = relevantFaqs
      .map((faq) => `Question: ${faq.question}\nAnswer: ${faq.answer}`)
      .join('\n\n');

    // 3. Construct prompt
    const systemPrompt = `You are a helpful assistant for the "Tariq ila Al-Jannah" app.
Use the following context from our FAQ to answer the user's question. 
If the answer is not in the context, say that you don't know and advise the user to contact support, but try to be as helpful as possible based on the context provided.
Answer in the same language as the user's question.

Context:
${context}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ];

    // 4. Get completion from Groq
    try {
      const response = await this.groqService.getChatCompletion(messages);
      return {
        answer: response.choices[0].message.content,
        sources: relevantFaqs.map(f => ({ question: f.question, id: f.id }))
      };
    } catch {
      // Graceful fallback when AI provider is unavailable/quota-limited.
      const fallbackAnswer =
        'عذرا، خدمة الذكاء الاصطناعي غير متاحة حاليا. يرجى المحاولة لاحقا أو التواصل مع الدعم.';
      return {
        answer: fallbackAnswer,
        sources: relevantFaqs.map(f => ({ question: f.question, id: f.id })),
      };
    }
  }
}

import { Injectable } from '@nestjs/common';
import { GroqService } from '../ai/groq.service';
import { User } from '../users/entities/user.entity';
import { Madhab, Dialect } from '@tariq/shared';

@Injectable()
export class FiqhService {
  constructor(private groqService: GroqService) {}

  private getSystemPrompt(madhab: Madhab, dialect: Dialect): string {
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

    return `أنت فقيه إسلامي عالم وموثوق. مهمتك هي الإجابة على أسئلة المستخدمين المتعلقة بالفقه الإسلامي.
يجب أن تتبع في فتاواك المذهب ${madhabName}.
يجب أن تتحدث مع المستخدم ب${dialectName}.
اجعل إجابتك دقيقة، سهلة الفهم، ومستندة إلى المصادر المعتبرة في المذهب ${madhabName}.
إذا كان هناك اختلاف داخل المذهب، فاذكر القول الراجح أو المشهور.
لا تخرج عن المذهب المحدد إلا إذا دعت الضرورة القصوى مع التنبيه على ذلك.`;
  }

  async getFiqhResponseStream(query: string, user: User) {
    const systemPrompt = this.getSystemPrompt(user.madhab, user.dialect);
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: query },
    ];

    return this.groqService.getChatCompletionStream(messages);
  }
}

import { Injectable } from '@nestjs/common';
import { GroqService } from '../ai/groq.service';
import { WeatherService } from './weather.service';
import { User } from '../users/entities/user.entity';
import { OutfitSuggestion, Gender, Madhab } from '@tariq/shared';

@Injectable()
export class StyleService {
  constructor(
    private groqService: GroqService,
    private weatherService: WeatherService,
  ) {}

  async getOutfitSuggestion(user: User, latitude?: number, longitude?: number): Promise<OutfitSuggestion> {
    const lat = latitude || user.latitude || 36.8065; // Default to Tunis
    const lon = longitude || user.longitude || 10.1815;

    const weather = await this.weatherService.getWeather(lat, lon);
    const weatherDesc = weather ? this.weatherService.getWeatherDescription(weather.weathercode) : 'Unknown';
    const temp = weather ? weather.temperature : 'Unknown';

    const systemPrompt = `You are an expert Islamic fashion consultant and stylist. 
Your task is to provide practical, modest, and stylish outfit suggestions based on the weather and Islamic modesty rules (Fiqh).
The user follows the ${user.madhab} madhab and is in Tunisia.
Always respond in the user's preferred language (Arabic/Tunisian dialect).
The output MUST be a JSON object with the following structure:
{
  "title": "Short catchy title",
  "description": "General description of the outfit",
  "items": ["item 1", "item 2", ...],
  "colors": ["color 1", "color 2", ...],
  "fabrics": ["fabric 1", "fabric 2", ...],
  "layers": ["layer 1", "layer 2", ...],
  "weatherAwareReason": "Why this is good for the current weather",
  "fiqhAwareReason": "Why this is compliant with modesty rules"
}`;

    const userPrompt = `Suggest an outfit for a ${user.gender} user.
Current Weather: ${weatherDesc}, Temperature: ${temp}°C.
Location: Tunisia.
Madhab: ${user.madhab}.
Please provide the suggestion in Tunisian dialect/Arabic.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    const response = await this.groqService.getChatCompletion(messages);
    const content = response.choices[0].message.content;
    
    try {
      // Find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Could not parse JSON from AI response');
    } catch (error) {
      console.error('Failed to parse Groq response:', content);
      // Fallback
      return {
        title: 'لباس محتشم ومريح',
        description: 'بناءً على الجو الحالي، ننصحك بارتداء ملابس مريحة ومحتشمة.',
        items: ['قميص واسع', 'سروال مريح'],
        colors: ['أبيض', 'أزرق'],
        fabrics: ['قطن'],
        layers: ['طبقة واحدة'],
        weatherAwareReason: 'مناسب لدرجة الحرارة الحالية.',
        fiqhAwareReason: 'يستر العورة ويناسب الضوابط الشرعية.',
      };
    }
  }
}

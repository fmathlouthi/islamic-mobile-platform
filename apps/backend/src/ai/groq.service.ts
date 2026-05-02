import { Injectable } from '@nestjs/common';
import { AppConfigService } from '../config/config.service';
import axios from 'axios';
import { Readable } from 'stream';

@Injectable()
export class GroqService {
  private readonly apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
  private readonly apiKey: string;

  constructor(private configService: AppConfigService) {
    this.apiKey = this.configService.groqApiKey;
  }

  async getChatCompletion(messages: any[]) {
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'llama3-8b-8192',
        messages,
        stream: false,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  }

  async getChatCompletionStream(messages: any[]): Promise<Readable> {
    const response = await axios.post(
      this.apiUrl,
      {
        model: 'llama3-8b-8192',
        messages,
        stream: true,
      },
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        responseType: 'stream',
      },
    );
    return response.data as Readable;
  }
}

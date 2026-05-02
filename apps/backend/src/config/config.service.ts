import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>('NODE_ENV', 'development');
  }

  get port(): number {
    return this.configService.get<number>('PORT', 3000);
  }

  get databaseHost(): string {
    return this.configService.get<string>('DB_HOST', 'localhost');
  }

  get databasePort(): number {
    return this.configService.get<number>('DB_PORT', 5432);
  }

  get databaseName(): string {
    return this.configService.get<string>('DB_NAME', 'tariq_jannah');
  }

  get databaseUsername(): string {
    return this.configService.get<string>('DB_USERNAME', 'tariq_user');
  }

  get databasePassword(): string {
    return this.configService.get<string>('DB_PASSWORD', 'tariq_password');
  }

  get jwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET', 'change-me-in-production');
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN', '7d');
  }

  get groqApiKey(): string {
    return this.configService.get<string>('GROQ_API_KEY', '');
  }

  get openaiApiKey(): string {
    return this.configService.get<string>('OPENAI_API_KEY', '');
  }

  get corsOrigin(): string {
    return this.configService.get<string>('CORS_ORIGIN', '*');
  }

  isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }
}

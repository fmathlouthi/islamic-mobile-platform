import { Module } from '@nestjs/common';
import { StyleService } from './style.service';
import { StyleController } from './style.controller';
import { WeatherService } from './weather.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [StyleController],
  providers: [StyleService, WeatherService],
  exports: [StyleService],
})
export class StyleModule {}

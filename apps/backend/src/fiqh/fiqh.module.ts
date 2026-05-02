import { Module } from '@nestjs/common';
import { FiqhController } from './fiqh.controller';
import { FiqhService } from './fiqh.service';
import { AiModule } from '../ai/ai.module';
import { ConfigModule } from '../config/config.module';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [ConfigModule, SubscriptionModule, AiModule],
  controllers: [FiqhController],
  providers: [FiqhService],
  exports: [FiqhService],
})
export class FiqhModule {}

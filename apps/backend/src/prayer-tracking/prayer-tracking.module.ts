import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayerTrackingService } from './prayer-tracking.service';
import { PrayerTrackingController } from './prayer-tracking.controller';
import { PrayerCompletion } from './entities/prayer-completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PrayerCompletion])],
  controllers: [PrayerTrackingController],
  providers: [PrayerTrackingService],
  exports: [PrayerTrackingService],
})
export class PrayerTrackingModule {}

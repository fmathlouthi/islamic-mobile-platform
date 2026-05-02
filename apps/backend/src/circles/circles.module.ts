import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CirclesService } from './circles.service';
import { CirclesController } from './circles.controller';
import { Circle } from './entities/circle.entity';
import { CircleMember } from './entities/circle-member.entity';
import { PrayerCompletion } from '../prayer-tracking/entities/prayer-completion.entity';
import { AthkarCompletion } from '../athkar/entities/athkar-completion.entity';
import { QuranProgress } from '../quran/entities/quran-progress.entity';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Circle,
      CircleMember,
      PrayerCompletion,
      AthkarCompletion,
      QuranProgress,
    ]),
    NotificationsModule,
  ],
  controllers: [CirclesController],
  providers: [CirclesService],
  exports: [CirclesService],
})
export class CirclesModule {}

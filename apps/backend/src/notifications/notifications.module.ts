import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsProcessor } from './notifications.processor';
import { FcmService } from './fcm.service';
import { NotificationsController } from './notifications.controller';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { PrayersModule } from '../prayers/prayers.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    BullModule.registerQueue({
      name: 'notifications',
    }),
    UsersModule,
    PrayersModule,
    CalendarModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsProcessor, FcmService],
  exports: [NotificationsService, FcmService],
})
export class NotificationsModule {}

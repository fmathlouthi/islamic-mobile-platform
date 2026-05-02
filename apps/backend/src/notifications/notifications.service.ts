import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FcmService } from './fcm.service';
import { UsersService } from '../users/users.service';
import { PrayersService } from '../prayers/prayers.service';
import { CalendarService } from '../calendar/calendar.service';
import { PrayerName, PRAYER_NAMES_AR, PRAYER_NAMES_EN } from '@tariq/shared';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private fcmService: FcmService,
    private usersService: UsersService,
    private prayersService: PrayersService,
    private calendarService: CalendarService,
    @InjectQueue('notifications') private readonly notificationsQueue: Queue,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async scheduleDailyNotifications() {
    this.logger.log('Scheduling daily notifications for all users');
    // In a real app, we might want to paginate this
    // For now, we'll get all users with FCM tokens
    // Actually, it's better to use BullMQ to process users in chunks
    await this.notificationsQueue.add('schedule-all-users', {});
  }

  async scheduleForUser(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.fcmToken || !user.notificationsEnabled) {
      return;
    }

    if (user.latitude === null || user.longitude === null) {
      this.logger.warn(`User ${userId} has no location set, cannot schedule prayer notifications`);
      return;
    }

    if (user.prayerTimeNotifications) {
      const prayerTimes = await this.prayersService.calculatePrayerTimes(
        user.latitude,
        user.longitude,
        undefined,
        user.calculationMethod,
      );

      for (const prayer of prayerTimes.prayers) {
        if (prayer.name === PrayerName.SUNRISE) continue;

        const prayerDate = new Date(`${prayerTimes.date}T${prayer.time}:00`);
        const now = new Date();

        if (prayerDate > now) {
          const delay = prayerDate.getTime() - now.getTime();
          await this.notificationsQueue.add(
            'send-prayer-notification',
            {
              userId: user.id,
              prayerName: prayer.name,
              token: user.fcmToken,
              language: user.language,
            },
            { delay },
          );
        }
      }
    }

    if (user.athkarReminders) {
      // Schedule morning and evening athkar
      // Simplified: Morning at 7 AM, Evening at 5 PM
      this.scheduleAthkar(user, 'morning', 7, 0);
      this.scheduleAthkar(user, 'evening', 17, 0);
    }

    if (user.islamicEventsNotifications) {
      const events = await this.calendarService.getEvents(new Date().getFullYear());
      const today = new Date().toISOString().split('T')[0];
      const todayEvent = events.find((event) => event.gregorianDate === today);

      if (todayEvent) {
        await this.notificationsQueue.add(
          'send-event-notification',
          {
            userId: user.id,
            eventNameAr: todayEvent.nameAr,
            eventNameEn: todayEvent.nameEn,
            token: user.fcmToken,
            language: user.language,
          },
          { delay: 1000 * 60 * 60 * 9 }, // Send at 9 AM
        );
      }
    }
  }

  private async scheduleAthkar(user: any, type: 'morning' | 'evening', hour: number, minute: number) {
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hour, minute, 0, 0);

    if (scheduledTime > now) {
      const delay = scheduledTime.getTime() - now.getTime();
      await this.notificationsQueue.add(
        'send-athkar-notification',
        {
          userId: user.id,
          type,
          token: user.fcmToken,
          language: user.language,
        },
        { delay },
      );
    }
  }

  async sendPrayerNotification(token: string, prayerName: PrayerName, language: string) {
    const title = language === 'ar' ? 'حان وقت الصلاة' : 'Prayer Time';
    const prayerNameStr = language === 'ar' ? PRAYER_NAMES_AR[prayerName] : PRAYER_NAMES_EN[prayerName];
    const body = language === 'ar' ? `حان وقت صلاة ${prayerNameStr}` : `It is time for ${prayerNameStr} prayer`;

    await this.fcmService.sendPushNotification(token, title, body, { prayerName });
  }

  async sendAthkarNotification(token: string, type: 'morning' | 'evening', language: string) {
    const title = language === 'ar' ? 'أذكار' : 'Athkar';
    const body = type === 'morning' 
      ? (language === 'ar' ? 'حان وقت أذكار الصباح' : 'Time for Morning Athkar')
      : (language === 'ar' ? 'حان وقت أذكار المساء' : 'Time for Evening Athkar');

    await this.fcmService.sendPushNotification(token, title, body, { type });
  }

  async sendEventNotification(token: string, nameAr: string, nameEn: string, language: string) {
    const title = language === 'ar' ? 'مناسبة إسلامية' : 'Islamic Event';
    const body = language === 'ar' ? nameAr : nameEn;

    await this.fcmService.sendPushNotification(token, title, body, { type: 'event' });
  }

  async sendEncouragementPing(sender: any, targetUserId: string) {
    const targetUser = await this.usersService.findById(targetUserId);
    if (!targetUser || !targetUser.fcmToken) {
      return;
    }

    const language = targetUser.language;
    const senderName = sender.name || (language === 'ar' ? 'فاعل خير' : 'Someone');

    const title = language === 'ar' ? 'تشجيع!' : 'Encouragement!';
    const body = language === 'ar'
      ? `قام ${senderName} بتشجيعك على العبادة! استمر!`
      : `${senderName} encouraged you in your worship! Keep it up!`;

    await this.fcmService.sendPushNotification(targetUser.fcmToken, title, body, {
      type: 'encouragement',
      senderId: sender.id,
    });
  }
}

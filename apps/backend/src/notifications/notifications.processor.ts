import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { NotificationsService } from './notifications.service';
import { UsersService } from '../users/users.service';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Processor('notifications')
export class NotificationsProcessor extends WorkerHost {
  constructor(
    private readonly notificationsService: NotificationsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'schedule-all-users':
        return this.handleScheduleAllUsers();
      case 'schedule-user':
        return this.notificationsService.scheduleForUser(job.data.userId);
      case 'send-prayer-notification':
        return this.notificationsService.sendPrayerNotification(
          job.data.token,
          job.data.prayerName,
          job.data.language,
        );
      case 'send-athkar-notification':
        return this.notificationsService.sendAthkarNotification(
          job.data.token,
          job.data.type,
          job.data.language,
        );
      case 'send-event-notification':
        return this.notificationsService.sendEventNotification(
          job.data.token,
          job.data.eventNameAr,
          job.data.eventNameEn,
          job.data.language,
        );
      default:
        break;
    }
  }

  private async handleScheduleAllUsers() {
    const users = await this.userRepository.find({
      where: {
        notificationsEnabled: true,
      },
      select: ['id', 'fcmToken'],
    });

    for (const user of users) {
      if (user.fcmToken) {
        await this.notificationsService.scheduleForUser(user.id);
      }
    }
  }
}

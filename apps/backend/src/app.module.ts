import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bullmq';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrayersModule } from './prayers/prayers.module';
import { AthkarModule } from './athkar/athkar.module';
import { FiqhModule } from './fiqh/fiqh.module';
import { HealthModule } from './health/health.module';
import { PrayerTrackingModule } from './prayer-tracking/prayer-tracking.module';
import { WuduModule } from './wudu/wudu.module';
import { CalendarModule } from './calendar/calendar.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AiModule } from './ai/ai.module';
import { FaqModule } from './faq/faq.module';
import { StyleModule } from './style/style.module';
import { QuranModule } from './quran/quran.module';
import { ZakatModule } from './zakat/zakat.module';
import { CirclesModule } from './circles/circles.module';
import { DreamsModule } from './dreams/dreams.module';
import { LocationModule } from './location/location.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'tariq_user'),
        password: configService.get<string>('DB_PASSWORD', 'tariq_password'),
        database: configService.get<string>('DB_NAME', 'tariq_jannah'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production',
        logging: configService.get<string>('NODE_ENV') !== 'production',
        autoLoadEntities: true,
      }),
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
        },
      }),
    }),
    AuthModule,
    UsersModule,
    PrayersModule,
    AthkarModule,
    FiqhModule,
    HealthModule,
    PrayerTrackingModule,
    WuduModule,
    CalendarModule,
    SubscriptionModule,
    NotificationsModule,
    AiModule,
    FaqModule,
    StyleModule,
    QuranModule,
    ZakatModule,
    CirclesModule,
    DreamsModule,
    LocationModule,
  ],
})
export class AppModule {}

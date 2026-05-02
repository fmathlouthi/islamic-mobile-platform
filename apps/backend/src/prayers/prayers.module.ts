import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayersController } from './prayers.controller';
import { PrayersService } from './prayers.service';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), UsersModule],
  controllers: [PrayersController],
  providers: [PrayersService],
  exports: [PrayersService],
})
export class PrayersModule {}

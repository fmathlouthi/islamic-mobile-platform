import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZakatService } from './zakat.service';
import { ZakatController } from './zakat.controller';
import { ZakatAsset } from './entities/zakat-asset.entity';
import { Sadaqah } from './entities/sadaqah.entity';
import { HawlCycle } from './entities/hawl-cycle.entity';
import { UsersModule } from '../users/users.module';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ZakatAsset, Sadaqah, HawlCycle]),
    UsersModule,
    AiModule,
  ],
  controllers: [ZakatController],
  providers: [ZakatService],
  exports: [ZakatService],
})
export class ZakatModule {}

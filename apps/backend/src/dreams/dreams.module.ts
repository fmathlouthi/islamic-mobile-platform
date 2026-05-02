import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DreamsService } from './dreams.service';
import { DreamsController } from './dreams.controller';
import { Dream } from './entities/dream.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Dream]),
    AiModule,
  ],
  controllers: [DreamsController],
  providers: [DreamsService],
  exports: [DreamsService],
})
export class DreamsModule {}

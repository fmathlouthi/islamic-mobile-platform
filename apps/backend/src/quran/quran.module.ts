import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuranController } from './quran.controller';
import { QuranService } from './quran.service';
import { QuranGoal } from './entities/quran-goal.entity';
import { QuranProgress } from './entities/quran-progress.entity';
import { QuranReflection } from './entities/quran-reflection.entity';
import { Khatm } from './entities/khatm.entity';
import { KhatmPart } from './entities/khatm-part.entity';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      QuranGoal,
      QuranProgress,
      QuranReflection,
      Khatm,
      KhatmPart,
    ]),
    AiModule,
  ],
  controllers: [QuranController],
  providers: [QuranService],
  exports: [QuranService],
})
export class QuranModule {}

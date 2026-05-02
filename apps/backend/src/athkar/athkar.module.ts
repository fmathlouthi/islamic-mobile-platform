import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AthkarController } from './athkar.controller';
import { AthkarService } from './athkar.service';
import { AthkarCategory } from './entities/athkar-category.entity';
import { AthkarItem } from './entities/athkar-item.entity';
import { AthkarCompletion } from './entities/athkar-completion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AthkarCategory, AthkarItem, AthkarCompletion])],
  controllers: [AthkarController],
  providers: [AthkarService],
  exports: [AthkarService],
})
export class AthkarModule {}

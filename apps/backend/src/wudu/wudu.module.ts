import { Module } from '@nestjs/common';
import { WuduService } from './wudu.service';
import { WuduController } from './wudu.controller';

@Module({
  controllers: [WuduController],
  providers: [WuduService],
})
export class WuduModule {}

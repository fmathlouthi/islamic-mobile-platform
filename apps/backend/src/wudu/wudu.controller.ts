import { Controller, Get } from '@nestjs/common';
import { WuduService } from './wudu.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Wudu')
@Controller('wudu')
export class WuduController {
  constructor(private readonly wuduService: WuduService) {}

  @Get('guide')
  @ApiOperation({ summary: 'Get step-by-step wudu guide' })
  getWuduGuide() {
    return { success: true, data: this.wuduService.getWuduGuide() };
  }
}

import { Controller, Get, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { ZakatService } from './zakat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { 
  AddZakatAssetRequest, 
  LogSadaqahRequest, 
  ApiResponse, 
  ZakatSummary,
  ZakatAsset as ZakatAssetInterface,
  SadaqahDonation
} from '@tariq/shared';
import { Response } from 'express';
import { ZakatAsset } from './entities/zakat-asset.entity';
import { Sadaqah } from './entities/sadaqah.entity';

@Controller('zakat')
@UseGuards(JwtAuthGuard)
export class ZakatController {
  constructor(private readonly zakatService: ZakatService) {}

  @Get('summary')
  async getSummary(@Req() req: any): Promise<ApiResponse<ZakatSummary>> {
    const summary = await this.zakatService.getSummary(req.user.id);
    return { success: true, data: summary };
  }

  @Post('assets')
  async addAsset(
    @Req() req: any,
    @Body() data: AddZakatAssetRequest
  ): Promise<ApiResponse<ZakatAssetInterface>> {
    const asset = await this.zakatService.addAsset(req.user.id, data);
    return { success: true, data: asset as any };
  }

  @Post('sadaqah')
  async logSadaqah(
    @Req() req: any,
    @Body() data: LogSadaqahRequest
  ): Promise<ApiResponse<SadaqahDonation>> {
    const sadaqah = await this.zakatService.logSadaqah(req.user.id, data);
    return { success: true, data: sadaqah as any };
  }

  @Post('ask-ai')
  async askAi(
    @Req() req: any,
    @Body('query') query: string,
    @Res() res: Response
  ) {
    const stream = await this.zakatService.askZakatAi(query, req.user);
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ text: content, isComplete: false })}\n\n`);
      }
    }
    
    res.write(`data: ${JSON.stringify({ text: '', isComplete: true })}\n\n`);
    res.end();
  }
}

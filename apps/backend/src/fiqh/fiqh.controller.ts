import { Controller, Post, Body, Res, UseGuards, Request as NestRequest } from '@nestjs/common';
import { Response, Request } from 'express';
import { FiqhService } from './fiqh.service';
import { FiqhRequest, SubscriptionPlan } from '@tariq/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { SubscriptionGuard } from '../subscription/guards/subscription.guard';
import { Plans } from '../subscription/decorators/plans.decorator';

@Controller('fiqh')
@UseGuards(JwtAuthGuard)
export class FiqhController {
  constructor(private fiqhService: FiqhService) {}

  @Post('ask')
  @UseGuards(SubscriptionGuard)
  @Plans(SubscriptionPlan.PREMIUM, SubscriptionPlan.FAMILY)
  async ask(@Body() fiqhRequest: FiqhRequest, @NestRequest() req: Request & { user: any }, @Res() res: Response) {
    const user = req.user;
    const stream = await this.fiqhService.getFiqhResponseStream(fiqhRequest.query, user);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    stream.on('data', (chunk: Buffer) => {
      res.write(chunk);
    });

    stream.on('end', () => {
      res.end();
    });

    stream.on('error', (err: Error) => {
      console.error('Stream error:', err);
      res.status(500).end();
    });
  }
}

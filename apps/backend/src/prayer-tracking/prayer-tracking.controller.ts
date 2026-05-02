import { Controller, Post, Get, Body, UseGuards, Request as NestRequest, BadRequestException } from '@nestjs/common';
import { Request } from 'express';
import { PrayerTrackingService } from './prayer-tracking.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PrayerName } from '@tariq/shared';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Prayer Tracking')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('prayer')
export class PrayerTrackingController {
  constructor(private readonly prayerTrackingService: PrayerTrackingService) {}

  @Post('complete')
  @ApiOperation({ summary: 'Mark a prayer as completed' })
  async completePrayer(
    @NestRequest() req: Request & { user: any },
    @Body() body: { prayerName?: PrayerName; prayer?: PrayerName; date?: string },
  ) {
    const userId = req.user.id;
    const prayerName = body.prayerName ?? body.prayer;
    if (!prayerName) {
      throw new BadRequestException('prayerName is required');
    }
    const date = body.date || new Date().toISOString().split('T')[0];
    const completion = await this.prayerTrackingService.completePrayer(userId, prayerName, date);
    return { success: true, data: completion };
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get current prayer streak' })
  async getStreak(@NestRequest() req: Request & { user: any }) {
    const userId = req.user.id;
    const streak = await this.prayerTrackingService.getStreak(userId);
    return { success: true, data: streak };
  }
}

import { Controller, Get, Query, UseGuards, Request as NestRequest } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { PrayersService } from './prayers.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CalculationMethod } from '@tariq/shared';

@ApiTags('prayers')
@Controller('prayers')
export class PrayersController {
  constructor(private readonly prayersService: PrayersService) {}

  @Get('times')
  @ApiOperation({ summary: 'Get prayer times for a location and date' })
  @ApiResponse({ status: 200, description: 'Prayer times retrieved successfully' })
  @ApiQuery({ name: 'latitude', required: true, type: Number, description: 'Location latitude' })
  @ApiQuery({ name: 'longitude', required: true, type: Number, description: 'Location longitude' })
  @ApiQuery({ name: 'date', required: false, type: String, description: 'Date in YYYY-MM-DD format' })
  @ApiQuery({ name: 'method', required: false, enum: CalculationMethod, description: 'Calculation method' })
  async getPrayerTimes(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('date') date?: string,
    @Query('method') method?: CalculationMethod,
  ) {
    return this.prayersService.calculatePrayerTimes(latitude, longitude, date, method);
  }

  @Get('times/today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's prayer times for authenticated user" })
  @ApiResponse({ status: 200, description: 'Prayer times retrieved successfully' })
  async getTodayPrayerTimes(@NestRequest() req: Request & { user: any }) {
    return this.prayersService.getTodayPrayerTimesForUser(req.user.id);
  }

  @Get('methods')
  @ApiOperation({ summary: 'Get available prayer time calculation methods' })
  @ApiResponse({ status: 200, description: 'Calculation methods retrieved' })
  async getCalculationMethods() {
    return this.prayersService.getCalculationMethods();
  }
}

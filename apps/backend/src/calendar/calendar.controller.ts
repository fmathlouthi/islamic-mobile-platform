import { Controller, Get, Query } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { IslamicEvent } from '@tariq/shared';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async getEvents(@Query('year') year?: string): Promise<IslamicEvent[]> {
    const targetYear = year ? parseInt(year, 10) : new Date().getFullYear();
    return this.calendarService.getEvents(targetYear);
  }

  @Get('next-event')
  async getNextEvent(): Promise<IslamicEvent | null> {
    return this.calendarService.getNextEvent();
  }
}

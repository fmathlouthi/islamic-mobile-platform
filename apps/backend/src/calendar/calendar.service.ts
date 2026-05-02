import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IslamicEvent } from './entities/islamic-event.entity';
import { IslamicEventType, IslamicEvent as IslamicEventInterface, HIJRI_MONTHS_EN, HIJRI_MONTHS_AR } from '@tariq/shared';
import moment from 'moment-hijri';

@Injectable()
export class CalendarService implements OnModuleInit {
  constructor(
    @InjectRepository(IslamicEvent)
    private readonly eventRepository: Repository<IslamicEvent>,
  ) {}

  async onModuleInit() {
    await this.seedEvents();
  }

  private async seedEvents() {
    const count = await this.eventRepository.count();
    if (count > 0) return;

    const initialEvents = [
      { nameEn: 'Islamic New Year', nameAr: 'رأس السنة الهجرية', hijriDay: 1, hijriMonth: 1, type: IslamicEventType.HOLIDAY },
      { nameEn: 'Ashura', nameAr: 'عاشوراء', hijriDay: 10, hijriMonth: 1, type: IslamicEventType.OBSERVANCE },
      { nameEn: 'Mawlid al-Nabi', nameAr: 'المولد النبوي', hijriDay: 12, hijriMonth: 3, type: IslamicEventType.OBSERVANCE },
      { nameEn: 'Ramadan Starts', nameAr: 'بداية رمضان', hijriDay: 1, hijriMonth: 9, type: IslamicEventType.HOLIDAY },
      { nameEn: 'Eid al-Fitr', nameAr: 'عيد الفطر', hijriDay: 1, hijriMonth: 10, type: IslamicEventType.HOLIDAY },
      { nameEn: 'Eid al-Adha', nameAr: 'عيد الأضحى', hijriDay: 10, hijriMonth: 12, type: IslamicEventType.HOLIDAY },
    ];

    await this.eventRepository.save(initialEvents);
  }

  async getEvents(year: number): Promise<IslamicEventInterface[]> {
    const events = await this.eventRepository.find();
    return events.map(event => {
      const gregorianDate = this.calculateGregorianDate(event.hijriDay, event.hijriMonth, year);
      return {
        ...event,
        gregorianDate,
      };
    });
  }

  async getNextEvent(): Promise<IslamicEventInterface | null> {
    const events = await this.eventRepository.find();
    const now = moment();
    
    let nextEvent: IslamicEventInterface | null = null;
    let minDiff = Infinity;

    // Check events in current Gregorian year and next one to be safe
    const currentYear = now.year();
    const yearsToCheck = [currentYear, currentYear + 1];

    for (const year of yearsToCheck) {
      for (const event of events) {
        const gregDateStr = this.calculateGregorianDate(event.hijriDay, event.hijriMonth, year);
        const gregDate = moment(gregDateStr, 'YYYY-MM-DD');
        
        if (gregDate.isAfter(now)) {
          const diff = gregDate.diff(now, 'days');
          if (diff < minDiff) {
            minDiff = diff;
            nextEvent = {
              ...event,
              gregorianDate: gregDateStr,
              daysRemaining: diff,
            } as IslamicEventInterface;
          }
        }
      }
    }

    return nextEvent;
  }

  private calculateGregorianDate(day: number, month: number, gregorianYear: number): string {
    // moment-hijri uses 1-based months for iMonth()? 
    // Actually iMonth() is 0-based in moment-hijri, similar to moment's month()
    // Let's verify. iMonth() 0 is Muharram.
    
    // We need to find the Gregorian date for a given Hijri day/month that falls within or near a Gregorian year.
    // Since Hijri year is shorter, a Hijri date might occur once or twice in a Gregorian year, or not at all?
    // Actually it will occur at least once.
    
    // Simple approach: find the Hijri year corresponding to the start of the Gregorian year.
    const startOfYear = moment(`${gregorianYear}-01-01`, 'YYYY-MM-DD');
    let hijriYear = startOfYear.iYear();
    
    // Try current Hijri year, previous, and next
    const potentialDates = [];
    for (let hy = hijriYear - 1; hy <= hijriYear + 1; hy++) {
      const m = moment().iYear(hy).iMonth(month - 1).iDate(day);
      if (m.year() === gregorianYear) {
        potentialDates.push(m.format('YYYY-MM-DD'));
      }
    }
    
    return potentialDates[0] || moment().iYear(hijriYear).iMonth(month - 1).iDate(day).format('YYYY-MM-DD');
  }
}

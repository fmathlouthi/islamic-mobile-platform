import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  PrayerName,
  CalculationMethod,
  PrayerTime,
  PrayerTimesResponse,
  PRAYER_NAMES_AR,
  PRAYER_NAMES_EN,
} from '@tariq/shared';
import { User } from '../users/entities/user.entity';
import { Coordinates, CalculationMethod as AdhanMethod, PrayerTimes } from 'adhan';

@Injectable()
export class PrayersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async calculatePrayerTimes(
    latitude: number,
    longitude: number,
    date?: string,
    method: CalculationMethod = CalculationMethod.MUSLIM_WORLD_LEAGUE,
  ): Promise<PrayerTimesResponse> {
    const targetDate = date ? new Date(date) : new Date();
    const coordinates = new Coordinates(latitude, longitude);
    const params = this.getAdhanParams(method);
    
    const adhanPrayerTimes = new PrayerTimes(coordinates, targetDate, params);

    const prayers: PrayerTime[] = [
      {
        name: PrayerName.FAJR,
        time: this.formatAdhanTime(adhanPrayerTimes.fajr),
        arabicName: PRAYER_NAMES_AR[PrayerName.FAJR],
        englishName: PRAYER_NAMES_EN[PrayerName.FAJR],
      },
      {
        name: PrayerName.SUNRISE,
        time: this.formatAdhanTime(adhanPrayerTimes.sunrise),
        arabicName: PRAYER_NAMES_AR[PrayerName.SUNRISE],
        englishName: PRAYER_NAMES_EN[PrayerName.SUNRISE],
      },
      {
        name: PrayerName.DHUHR,
        time: this.formatAdhanTime(adhanPrayerTimes.dhuhr),
        arabicName: PRAYER_NAMES_AR[PrayerName.DHUHR],
        englishName: PRAYER_NAMES_EN[PrayerName.DHUHR],
      },
      {
        name: PrayerName.ASR,
        time: this.formatAdhanTime(adhanPrayerTimes.asr),
        arabicName: PRAYER_NAMES_AR[PrayerName.ASR],
        englishName: PRAYER_NAMES_EN[PrayerName.ASR],
      },
      {
        name: PrayerName.MAGHRIB,
        time: this.formatAdhanTime(adhanPrayerTimes.maghrib),
        arabicName: PRAYER_NAMES_AR[PrayerName.MAGHRIB],
        englishName: PRAYER_NAMES_EN[PrayerName.MAGHRIB],
      },
      {
        name: PrayerName.ISHAA,
        time: this.formatAdhanTime(adhanPrayerTimes.isha),
        arabicName: PRAYER_NAMES_AR[PrayerName.ISHAA],
        englishName: PRAYER_NAMES_EN[PrayerName.ISHAA],
      },
    ];

    return {
      date: targetDate.toISOString().split('T')[0],
      location: { latitude, longitude },
      calculationMethod: method,
      prayers,
    };
  }

  async getTodayPrayerTimesForUser(userId: string): Promise<PrayerTimesResponse> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || user.latitude === null || user.longitude === null) {
      throw new Error('User location not set. Please update your location in profile settings.');
    }

    return this.calculatePrayerTimes(
      Number(user.latitude),
      Number(user.longitude),
      undefined,
      user.calculationMethod,
    );
  }

  getCalculationMethods(): Array<{ id: CalculationMethod; name: string; description: string }> {
    return [
      { id: CalculationMethod.MUSLIM_WORLD_LEAGUE, name: 'Muslim World League', description: 'Fajr 18°, Isha 17°' },
      { id: CalculationMethod.EGYPTIAN, name: 'Egyptian', description: 'Fajr 19.5°, Isha 17.5°' },
      { id: CalculationMethod.KARACHI, name: 'Karachi', description: 'Fajr 18°, Isha 18°' },
      { id: CalculationMethod.Umm_AL_QURA, name: 'Umm Al-Qura', description: 'Fajr 18.5°, Isha 90 min after Maghrib' },
      { id: CalculationMethod.DUBAI, name: 'Dubai', description: 'Fajr 18.2°, Isha 18.2°' },
      { id: CalculationMethod.KUWAIT, name: 'Kuwait', description: 'Fajr 18°, Isha 17.5°' },
      { id: CalculationMethod.MOON_PAKISTAN, name: 'Moon Pakistan', description: 'Fajr 18°, Isha 18°' },
      { id: CalculationMethod.TURKEY, name: 'Turkey', description: 'Fajr 18°, Isha 17°' },
      { id: CalculationMethod.TANZANIA, name: 'Tanzania', description: 'Fajr 18°, Isha 18°' },
    ];
  }

  private getAdhanParams(method: CalculationMethod) {
    switch (method) {
      case CalculationMethod.MUSLIM_WORLD_LEAGUE:
        return AdhanMethod.MuslimWorldLeague();
      case CalculationMethod.EGYPTIAN:
        return AdhanMethod.Egyptian();
      case CalculationMethod.KARACHI:
        return AdhanMethod.Karachi();
      case CalculationMethod.Umm_AL_QURA:
        return AdhanMethod.UmmAlQura();
      case CalculationMethod.DUBAI:
        return AdhanMethod.Dubai();
      case CalculationMethod.KUWAIT:
        return AdhanMethod.Kuwait();
      case CalculationMethod.MOON_PAKISTAN:
        return AdhanMethod.MoonsightingCommittee();
      case CalculationMethod.TURKEY:
        return AdhanMethod.Turkey();
      case CalculationMethod.TANZANIA:
        return AdhanMethod.Other();
      default:
        return AdhanMethod.MuslimWorldLeague();
    }
  }

  private formatAdhanTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

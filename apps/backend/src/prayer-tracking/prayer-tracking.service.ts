import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerCompletion } from './entities/prayer-completion.entity';
import { PrayerName, PrayerStreak } from '@tariq/shared';

@Injectable()
export class PrayerTrackingService {
  constructor(
    @InjectRepository(PrayerCompletion)
    private prayerCompletionRepository: Repository<PrayerCompletion>,
  ) {}

  async completePrayer(userId: string, prayerName: PrayerName, date: string): Promise<PrayerCompletion> {
    if (!prayerName) {
      throw new BadRequestException('prayerName is required');
    }

    const existing = await this.prayerCompletionRepository.findOne({
      where: { userId, prayerName, date },
    });

    if (existing) {
      return existing;
    }

    const completion = this.prayerCompletionRepository.create({
      userId,
      prayerName,
      date,
    });

    try {
      return await this.prayerCompletionRepository.save(completion);
    } catch (error) {
      // Handle potential race condition
      const checkAgain = await this.prayerCompletionRepository.findOne({
        where: { userId, prayerName, date },
      });
      if (checkAgain) {
        return checkAgain;
      }
      throw error;
    }
  }

  async getStreak(userId: string): Promise<PrayerStreak> {
    const completions = await this.prayerCompletionRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });

    if (completions.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    const uniqueDates = Array.from(new Set(completions.map(c => c.date))).sort((a, b) => b.localeCompare(a));
    
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    const latestDate = uniqueDates[0];

    if (latestDate === today || latestDate === yesterday) {
      let checkDate = new Date(latestDate);
      for (const date of uniqueDates) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (date === dateStr) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    const sortedAsc = [...uniqueDates].sort((a, b) => a.localeCompare(b));

    for (const date of sortedAsc) {
        const currentDate = new Date(date);
        if (prevDate) {
            const diffTime = Math.abs(currentDate.getTime() - prevDate.getTime());
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }
        prevDate = currentDate;
        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }
    }

    return {
      currentStreak,
      longestStreak,
      lastCompletionDate: latestDate,
    };
  }
}

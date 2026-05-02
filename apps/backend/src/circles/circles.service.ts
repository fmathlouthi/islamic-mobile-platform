import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Circle } from './entities/circle.entity';
import { CircleMember } from './entities/circle-member.entity';
import { CreateCircleRequest, JoinCircleRequest, CircleProgress, CircleLeaderboard } from '@tariq/shared';
import { PrayerCompletion } from '../prayer-tracking/entities/prayer-completion.entity';
import { AthkarCompletion } from '../athkar/entities/athkar-completion.entity';
import { QuranProgress } from '../quran/entities/quran-progress.entity';
import moment from 'moment';

@Injectable()
export class CirclesService {
  constructor(
    @InjectRepository(Circle)
    private readonly circleRepository: Repository<Circle>,
    @InjectRepository(CircleMember)
    private readonly memberRepository: Repository<CircleMember>,
    @InjectRepository(PrayerCompletion)
    private readonly prayerRepository: Repository<PrayerCompletion>,
    @InjectRepository(AthkarCompletion)
    private readonly athkarRepository: Repository<AthkarCompletion>,
    @InjectRepository(QuranProgress)
    private readonly quranRepository: Repository<QuranProgress>,
  ) {}

  async createCircle(userId: string, request: CreateCircleRequest): Promise<Circle> {
    const inviteCode = this.generateInviteCode();
    const circle = this.circleRepository.create({
      ...request,
      creatorId: userId,
      inviteCode,
    });

    const savedCircle = await this.circleRepository.save(circle);
    
    // Creator automatically becomes a member
    await this.joinCircle(userId, { inviteCode });

    return savedCircle;
  }

  async joinCircle(userId: string, request: JoinCircleRequest): Promise<Circle> {
    const circle = await this.circleRepository.findOne({ where: { inviteCode: request.inviteCode } });
    if (!circle) {
      throw new NotFoundException('Circle not found');
    }

    const existingMember = await this.memberRepository.findOne({
      where: { circleId: circle.id, userId },
    });

    if (existingMember) {
      return circle;
    }

    const member = this.memberRepository.create({
      circleId: circle.id,
      userId,
    });

    await this.memberRepository.save(member);
    return circle;
  }

  async getMyCircles(userId: string): Promise<Circle[]> {
    const memberships = await this.memberRepository.find({
      where: { userId },
      relations: ['circle'],
    });

    return memberships.map((m) => m.circle);
  }

  async getCircleDetails(circleId: string, userId: string): Promise<any> {
    const member = await this.memberRepository.findOne({
      where: { circleId, userId },
      relations: ['circle', 'circle.creator'],
    });

    if (!member) {
      throw new ForbiddenException('You are not a member of this circle');
    }

    const membersCount = await this.memberRepository.count({ where: { circleId } });

    return {
      ...member.circle,
      membersCount,
    };
  }

  async getLeaderboard(circleId: string, userId: string, period: string = 'weekly'): Promise<CircleLeaderboard> {
    const isMember = await this.memberRepository.findOne({ where: { circleId, userId } });
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this circle');
    }

    const members = await this.memberRepository.find({
      where: { circleId },
      relations: ['user'],
    });

    const memberIds = members.map((m) => m.userId);
    
    let startDate: Date;
    if (period === 'daily') {
      startDate = moment().startOf('day').toDate();
    } else if (period === 'monthly') {
      startDate = moment().startOf('month').toDate();
    } else if (period === 'all-time') {
      startDate = new Date(0);
    } else {
      // Default to weekly
      startDate = moment().startOf('week').toDate();
    }

    const startDateStr = moment(startDate).format('YYYY-MM-DD');
    const endDateStr = moment().format('YYYY-MM-DD');

    const prayerCompletions = await this.prayerRepository.find({
      where: { userId: In(memberIds), date: Between(startDateStr, endDateStr) },
    });

    const athkarCompletions = await this.athkarRepository.find({
      where: { userId: In(memberIds), date: Between(startDateStr, endDateStr) },
    });

    const quranProgress = await this.quranRepository.find({
      where: { userId: In(memberIds), date: Between(startDateStr, endDateStr) },
    });

    const rankings: CircleProgress[] = members.map((member) => {
      const userPrayers = prayerCompletions.filter((p) => p.userId === member.userId).length;
      const userAthkar = athkarCompletions
        .filter((a) => a.userId === member.userId)
        .reduce((acc, curr) => acc + curr.count, 0);
      const userQuran = quranProgress
        .filter((q) => q.userId === member.userId)
        .reduce((acc, curr) => acc + curr.pagesRead, 0);

      const totalPoints = userPrayers * 10 + userAthkar + Math.floor(userQuran * 20);

      return {
        userId: member.userId,
        userName: member.user?.name || 'Anonymous',
        dhikrCount: userAthkar,
        quranPages: userQuran,
        prayerCount: userPrayers,
        totalPoints,
      };
    });

    rankings.sort((a, b) => b.totalPoints - a.totalPoints);

    return {
      circleId,
      period: period as any,
      rankings,
    };
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }
}

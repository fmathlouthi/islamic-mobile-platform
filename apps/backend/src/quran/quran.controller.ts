import { Controller, Get, Post, Body, UseGuards, Request, Param } from '@nestjs/common';
import { QuranService } from './quran.service';
import { CreateQuranGoalRequest, LogQuranProgressRequest, CreateKhatmRequest, ClaimKhatmPartRequest } from '@tariq/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('quran')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('quran')
export class QuranController {
  constructor(private readonly quranService: QuranService) {}

  @Post('goals')
  @ApiOperation({ summary: 'Create a new Quran goal' })
  async createGoal(@Request() req: any, @Body() data: CreateQuranGoalRequest) {
    const goal = await this.quranService.createGoal(req.user.id, data);
    return { success: true, data: goal };
  }

  @Get('goals')
  @ApiOperation({ summary: 'Get active Quran goals' })
  async getGoals(@Request() req: any) {
    const goals = await this.quranService.getGoals(req.user.id);
    return { success: true, data: goals };
  }

  @Post('progress')
  @ApiOperation({ summary: 'Log Quran reading progress' })
  async logProgress(@Request() req: any, @Body() data: LogQuranProgressRequest) {
    const progress = await this.quranService.logProgress(req.user.id, data);
    return { success: true, data: progress };
  }

  @Get('progress')
  @ApiOperation({ summary: 'Get recent Quran progress' })
  async getProgress(@Request() req: any) {
    const progress = await this.quranService.getProgress(req.user.id);
    return { success: true, data: progress };
  }

  @Get('streak')
  @ApiOperation({ summary: 'Get Quran reading streak' })
  async getStreak(@Request() req: any) {
    const streak = await this.quranService.getStreak(req.user.id);
    return { success: true, data: streak };
  }

  @Get('reflections')
  @ApiOperation({ summary: 'Get AI reflections' })
  async getReflections(@Request() req: any) {
    const reflections = await this.quranService.getReflections(req.user.id);
    return { success: true, data: reflections };
  }

  // Group Khatm Endpoints

  @Post('circles/:circleId/khatm')
  @ApiOperation({ summary: 'Create a new group khatm for a circle' })
  async createKhatm(@Param('circleId') circleId: string, @Body() data: CreateKhatmRequest) {
    const khatm = await this.quranService.createKhatm(circleId, data);
    return { success: true, data: khatm };
  }

  @Get('circles/:circleId/khatm')
  @ApiOperation({ summary: 'Get all khatms for a circle' })
  async getKhatms(@Param('circleId') circleId: string) {
    const khatms = await this.quranService.getKhatms(circleId);
    return { success: true, data: khatms };
  }

  @Post('khatm/:khatmId/claim')
  @ApiOperation({ summary: 'Claim a juz in a group khatm' })
  async claimPart(@Request() req: any, @Param('khatmId') khatmId: string, @Body() data: ClaimKhatmPartRequest) {
    const part = await this.quranService.claimKhatmPart(req.user.id, khatmId, data.juzNumber);
    return { success: true, data: part };
  }

  @Post('khatm/:khatmId/complete')
  @ApiOperation({ summary: 'Mark a juz as complete in a group khatm' })
  async completePart(@Request() req: any, @Param('khatmId') khatmId: string, @Body() data: ClaimKhatmPartRequest) {
    const part = await this.quranService.markKhatmPartComplete(req.user.id, khatmId, data.juzNumber);
    return { success: true, data: part };
  }
}

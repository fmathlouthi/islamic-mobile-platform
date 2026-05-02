import { Controller, Post, Get, Body, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { CirclesService } from './circles.service';
import { CreateCircleRequest, JoinCircleRequest } from '@tariq/shared';
import { NotificationsService } from '../notifications/notifications.service';
import { User } from '../users/entities/user.entity';

@ApiTags('Circles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('circles')
export class CirclesController {
  constructor(
    private readonly circlesService: CirclesService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new spiritual circle' })
  createCircle(@GetUser('id') userId: string, @Body() request: CreateCircleRequest) {
    return this.circlesService.createCircle(userId, request);
  }

  @Post('join')
  @ApiOperation({ summary: 'Join a circle via invite code' })
  joinCircle(@GetUser('id') userId: string, @Body() request: JoinCircleRequest) {
    return this.circlesService.joinCircle(userId, request);
  }

  @Get()
  @ApiOperation({ summary: 'Get circles I am a member of' })
  getMyCircles(@GetUser('id') userId: string) {
    return this.circlesService.getMyCircles(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get circle details' })
  getCircleDetails(@Param('id') circleId: string, @GetUser('id') userId: string) {
    return this.circlesService.getCircleDetails(circleId, userId);
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Get circle leaderboard' })
  getLeaderboard(
    @Param('id') circleId: string,
    @GetUser('id') userId: string,
    @Query('period') period: string,
  ) {
    return this.circlesService.getLeaderboard(circleId, userId, period);
  }

  @Post(':id/members/:targetUserId/ping')
  @ApiOperation({ summary: 'Send encouragement ping to a circle member' })
  async sendPing(
    @Param('id') circleId: string,
    @Param('targetUserId') targetUserId: string,
    @GetUser() sender: User,
  ) {
    // Validate both are in the same circle
    await this.circlesService.getCircleDetails(circleId, sender.id);
    await this.circlesService.getCircleDetails(circleId, targetUserId);

    await this.notificationsService.sendEncouragementPing(sender, targetUserId);
    return { success: true };
  }
}

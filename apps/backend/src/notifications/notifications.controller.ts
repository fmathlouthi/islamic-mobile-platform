import { Controller, Post, Body, UseGuards, Request as NestRequest, Patch } from '@nestjs/common';
import { Request } from 'express';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { UpdateFcmTokenRequest, UpdateNotificationSettingsRequest } from '@tariq/shared';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly usersService: UsersService) {}

  @Post('token')
  @ApiOperation({ summary: 'Register FCM token' })
  async registerToken(@NestRequest() req: Request & { user: any }, @Body() updateFcmTokenDto: UpdateFcmTokenRequest) {
    return this.usersService.update(req.user.id, {
      fcmToken: updateFcmTokenDto.fcmToken,
    });
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update notification settings' })
  async updateSettings(@NestRequest() req: Request & { user: any }, @Body() settings: UpdateNotificationSettingsRequest) {
    return this.usersService.update(req.user.id, settings);
  }
}

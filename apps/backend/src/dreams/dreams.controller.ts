import { Controller, Get, Post, Body, Param, Delete, UseGuards } from '@nestjs/common';
import { DreamsService } from './dreams.service';
import { CreateDreamRequest } from '@tariq/shared';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('dreams')
@UseGuards(JwtAuthGuard)
export class DreamsController {
  constructor(private readonly dreamsService: DreamsService) {}

  @Post()
  create(@CurrentUser() user: User, @Body() createDreamRequest: CreateDreamRequest) {
    return this.dreamsService.create(user.id, createDreamRequest);
  }

  @Get()
  findAll(@CurrentUser() user: User) {
    return this.dreamsService.findAll(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: User, @Param('id') id: string) {
    return this.dreamsService.findOne(user.id, id);
  }

  @Post(':id/interpret')
  interpret(@CurrentUser() user: User, @Param('id') id: string) {
    return this.dreamsService.interpret(user.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.dreamsService.delete(user.id, id);
  }
}

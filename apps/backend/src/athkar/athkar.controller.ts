import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AthkarService } from './athkar.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { LogAthkarCompletionRequest } from '@tariq/shared';

@ApiTags('athkar')
@Controller('athkar')
export class AthkarController {
  constructor(private readonly athkarService: AthkarService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all athkar categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
  async getCategories() {
    return this.athkarService.getCategories();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get athkar items by category' })
  @ApiResponse({ status: 200, description: 'Athkar items retrieved successfully' })
  async getByCategory(@Param('category') category: string) {
    return this.athkarService.getByCategory(category);
  }

  @Get('all')
  @ApiOperation({ summary: 'Get all athkar items' })
  @ApiResponse({ status: 200, description: 'All athkar items retrieved successfully' })
  async getAllAthkar() {
    return this.athkarService.getAllAthkar();
  }

  @Get('random/:category')
  @ApiOperation({ summary: 'Get random athkar from a category' })
  @ApiResponse({ status: 200, description: 'Random athkar retrieved successfully' })
  async getRandomAthkar(@Param('category') category: string) {
    return this.athkarService.getRandomAthkar(category);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('complete')
  @ApiOperation({ summary: 'Log athkar completion' })
  @ApiResponse({ status: 201, description: 'Athkar completion logged successfully' })
  async logCompletion(@GetUser('id') userId: string, @Body() request: LogAthkarCompletionRequest) {
    return this.athkarService.logCompletion(userId, request);
  }
}

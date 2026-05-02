import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StyleService } from './style.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OutfitSuggestionRequest } from '@tariq/shared';

@ApiTags('Style')
@Controller('style')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class StyleController {
  constructor(private readonly styleService: StyleService) {}

  @Get('outfit-suggestion')
  @ApiOperation({ summary: 'Get a refined AI outfit suggestion based on weather and fiqh' })
  @ApiResponse({ status: 200, description: 'Return an outfit suggestion' })
  async getOutfitSuggestion(
    @Request() req: any,
    @Query() query: OutfitSuggestionRequest,
  ) {
    return this.styleService.getOutfitSuggestion(
      req.user,
      query.latitude ? Number(query.latitude) : undefined,
      query.longitude ? Number(query.longitude) : undefined,
    );
  }
}

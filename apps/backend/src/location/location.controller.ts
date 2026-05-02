import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { Mosque, QiblaResponse, NearbyMosquesRequest } from '@tariq/shared';

@ApiTags('location')
@Controller('location')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('qibla')
  @ApiOperation({ summary: 'Get Qibla direction' })
  @ApiResponse({ status: 200, description: 'Return Qibla direction in degrees' })
  @ApiQuery({ name: 'latitude', required: true, type: Number })
  @ApiQuery({ name: 'longitude', required: true, type: Number })
  getQibla(@Query('latitude') lat: number, @Query('longitude') lon: number): QiblaResponse {
    return this.locationService.getQiblaDirection(Number(lat), Number(lon));
  }

  @Get('mosques')
  @ApiOperation({ summary: 'Get nearby mosques' })
  @ApiResponse({ status: 200, description: 'Return list of nearby mosques' })
  async getNearbyMosques(@Query() query: NearbyMosquesRequest): Promise<Mosque[]> {
    return this.locationService.getNearbyMosques(
      Number(query.latitude),
      Number(query.longitude),
      query.radius ? Number(query.radius) : undefined,
    );
  }
}

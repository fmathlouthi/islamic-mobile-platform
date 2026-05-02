import { Test, TestingModule } from '@nestjs/testing';
import { LocationService } from './location.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('LocationService', () => {
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocationService],
    }).compile();

    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQiblaDirection', () => {
    it('should calculate Qibla direction correctly', () => {
      // Mecca is at approx (21.4225, 39.8262)
      // From London (51.5074, -0.1278), Qibla is approx 118.98 degrees
      const result = service.getQiblaDirection(51.5074, -0.1278);
      expect(result.direction).toBeCloseTo(118.98, 1);
    });
  });

  describe('getNearbyMosques', () => {
    it('should fetch nearby mosques from Overpass API', async () => {
      const mockResponse = {
        data: {
          elements: [
            {
              type: 'node',
              id: 1,
              lat: 51.5074,
              lon: -0.1278,
              tags: {
                name: 'Test Mosque',
                'addr:street': 'Test Street',
              },
            },
          ],
        },
      };
      mockedAxios.get.mockResolvedValueOnce(mockResponse);

      const result = await service.getNearbyMosques(51.5074, -0.1278, 1000);

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Test Mosque');
      expect(result[0].distance).toBe(0);
      expect(mockedAxios.get).toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      mockedAxios.get.mockRejectedValueOnce(new Error('API Error'));

      const result = await service.getNearbyMosques(51.5074, -0.1278, 1000);

      expect(result).toHaveLength(0);
    });
  });
});

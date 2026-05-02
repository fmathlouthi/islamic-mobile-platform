import { Test, TestingModule } from '@nestjs/testing';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';

describe('LocationController', () => {
  let controller: LocationController;
  let service: LocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationController],
      providers: [
        {
          provide: LocationService,
          useValue: {
            getQiblaDirection: jest.fn().mockReturnValue({ direction: 123 }),
            getNearbyMosques: jest.fn().mockResolvedValue([{ id: '1', name: 'Mosque' }]),
          },
        },
      ],
    }).compile();

    controller = module.get<LocationController>(LocationController);
    service = module.get<LocationService>(LocationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getQibla', () => {
    it('should return qibla direction', () => {
      const result = controller.getQibla(51.5, -0.1);
      expect(result).toEqual({ direction: 123 });
      expect(service.getQiblaDirection).toHaveBeenCalledWith(51.5, -0.1);
    });
  });

  describe('getNearbyMosques', () => {
    it('should return nearby mosques', async () => {
      const result = await controller.getNearbyMosques({ latitude: 51.5, longitude: -0.1, radius: 1000 });
      expect(result).toEqual([{ id: '1', name: 'Mosque' }]);
      expect(service.getNearbyMosques).toHaveBeenCalledWith(51.5, -0.1, 1000);
    });
  });
});

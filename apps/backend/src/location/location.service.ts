import { Injectable, Logger } from '@nestjs/common';
import { Coordinates, Qibla } from 'adhan';
import axios from 'axios';
import { Mosque, QiblaResponse } from '@tariq/shared';

@Injectable()
export class LocationService {
  private readonly logger = new Logger(LocationService.name);

  getQiblaDirection(latitude: number, longitude: number): QiblaResponse {
    const coordinates = new Coordinates(latitude, longitude);
    const qiblaDirection = Qibla(coordinates);
    return { direction: qiblaDirection };
  }

  async getNearbyMosques(latitude: number, longitude: number, radius: number = 5000): Promise<Mosque[]> {
    try {
      // Overpass API query for mosques
      const query = `
        [out:json];
        node["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${latitude},${longitude});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${latitude},${longitude});
        relation["amenity"="place_of_worship"]["religion"="muslim"](around:${radius},${latitude},${longitude});
        out center;
      `;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
      
      const response = await axios.get(url);
      const elements = response.data.elements;

      return elements.map((el: any) => {
        const lat = el.lat || el.center?.lat;
        const lon = el.lon || el.center?.lon;
        const distance = this.calculateDistance(latitude, longitude, lat, lon);
        
        return {
          id: el.id.toString(),
          name: el.tags?.name || el.tags?.['name:en'] || el.tags?.['name:ar'] || 'Mosque',
          latitude: lat,
          longitude: lon,
          address: el.tags?.['addr:full'] || el.tags?.['addr:street'] || el.tags?.['addr:city'] || undefined,
          distance: Math.round(distance),
          travelTime: Math.round(distance / 80), // Rough estimate: 80m/min walking speed
          rating: 4.5, // Mock rating as Overpass doesn't provide it
        };
      }).sort((a: Mosque, b: Mosque) => (a.distance || 0) - (b.distance || 0));
    } catch (error: any) {
      this.logger.error(`Error fetching mosques: ${error.message}`);
      return [];
    }
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }
}

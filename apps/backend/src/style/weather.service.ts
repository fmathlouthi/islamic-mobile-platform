import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class WeatherService {
  private readonly apiUrl = 'https://api.open-meteo.com/v1/forecast';

  async getWeather(lat: number, lon: number) {
    try {
      const response = await axios.get(this.apiUrl, {
        params: {
          latitude: lat,
          longitude: lon,
          current_weather: true,
          hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m',
        },
      });
      return {
        temperature: response.data.current_weather.temperature,
        windspeed: response.data.current_weather.windspeed,
        weathercode: response.data.current_weather.weathercode,
        is_day: response.data.current_weather.is_day,
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  getWeatherDescription(code: number): string {
    // Basic interpretation of WMO Weather interpretation codes (WW)
    if (code === 0) return 'Clear sky';
    if (code >= 1 && code <= 3) return 'Mainly clear, partly cloudy, and overcast';
    if (code >= 45 && code <= 48) return 'Fog and depositing rime fog';
    if (code >= 51 && code <= 55) return 'Drizzle: Light, moderate, and dense intensity';
    if (code >= 61 && code <= 65) return 'Rain: Slight, moderate and heavy intensity';
    if (code >= 71 && code <= 75) return 'Snow fall: Slight, moderate, and heavy intensity';
    if (code >= 80 && code <= 82) return 'Rain showers: Slight, moderate, and violent';
    if (code === 95) return 'Thunderstorm: Slight or moderate';
    return 'Unknown';
  }
}

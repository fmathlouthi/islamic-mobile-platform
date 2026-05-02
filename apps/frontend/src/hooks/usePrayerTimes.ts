import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { CalculationMethod, PrayerTimesResponse } from '@tariq/shared';

export function usePrayerTimes(
  latitude?: number,
  longitude?: number,
  date?: string,
  method?: CalculationMethod
) {
  return useQuery({
    queryKey: ['prayerTimes', latitude, longitude, date, method],
    queryFn: () => apiClient.getPrayerTimes(latitude!, longitude!, date, method),
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useTodayPrayerTimes() {
  return useQuery({
    queryKey: ['prayerTimes', 'today'],
    queryFn: () => apiClient.getTodayPrayerTimes(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

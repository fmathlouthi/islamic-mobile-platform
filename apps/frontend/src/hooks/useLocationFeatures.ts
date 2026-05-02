import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Mosque, QiblaResponse } from '@tariq/shared';

export function useQibla(latitude?: number, longitude?: number) {
  return useQuery<QiblaResponse>({
    queryKey: ['qibla', latitude, longitude],
    queryFn: () => apiClient.getQibla(latitude!, longitude!),
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useNearbyMosques(latitude?: number, longitude?: number, radius?: number) {
  return useQuery<Mosque[]>({
    queryKey: ['nearbyMosques', latitude, longitude, radius],
    queryFn: () => apiClient.getNearbyMosques(latitude!, longitude!, radius),
    enabled: !!latitude && !!longitude,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

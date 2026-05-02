import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { PrayerName, PrayerStreak } from '@tariq/shared';

export const usePrayerStreak = () => {
  return useQuery({
    queryKey: ['prayer-streak'],
    queryFn: async () => {
      const response = await apiClient.getPrayerStreak();
      return response.data as PrayerStreak;
    },
  });
};

export const useCompletePrayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prayerName, date }: { prayerName: PrayerName; date?: string }) => {
      const response = await apiClient.completePrayer(prayerName, date);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayer-streak'] });
    },
  });
};

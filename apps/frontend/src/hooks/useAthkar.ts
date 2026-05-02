import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function useAthkarCategories() {
  return useQuery({
    queryKey: ['athkar', 'categories'],
    queryFn: () => apiClient.getAthkarCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useAthkarByCategory(category: string) {
  return useQuery({
    queryKey: ['athkar', 'category', category],
    queryFn: () => apiClient.getAthkarByCategory(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useRandomAthkar(category: string) {
  return useQuery({
    queryKey: ['athkar', 'random', category],
    queryFn: () => apiClient.getRandomAthkar(category),
    enabled: !!category,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

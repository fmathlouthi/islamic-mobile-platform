import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { WuduStep } from '@tariq/shared';

export const useWuduGuide = () => {
  return useQuery({
    queryKey: ['wudu-guide'],
    queryFn: async () => {
      const response = await apiClient.getWuduGuide();
      return response.data as WuduStep[];
    },
  });
};

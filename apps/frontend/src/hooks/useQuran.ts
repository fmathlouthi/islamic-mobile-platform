import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { 
  CreateQuranGoalRequest, 
  LogQuranProgressRequest, 
  QuranGoal, 
  QuranProgress, 
  QuranReflection, 
  QuranStreak 
} from '@tariq/shared';

export const useQuranGoals = () => {
  return useQuery({
    queryKey: ['quran-goals'],
    queryFn: async () => {
      const response = await apiClient.getQuranGoals();
      return response.data as QuranGoal[];
    },
  });
};

export const useCreateQuranGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateQuranGoalRequest) => {
      const response = await apiClient.createQuranGoal(data);
      return response.data as QuranGoal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quran-goals'] });
    },
  });
};

export const useQuranProgress = () => {
  return useQuery({
    queryKey: ['quran-progress'],
    queryFn: async () => {
      const response = await apiClient.getQuranProgress();
      return response.data as QuranProgress[];
    },
  });
};

export const useLogQuranProgress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: LogQuranProgressRequest) => {
      const response = await apiClient.logQuranProgress(data);
      return response.data as QuranProgress;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quran-progress'] });
      queryClient.invalidateQueries({ queryKey: ['quran-streak'] });
      queryClient.invalidateQueries({ queryKey: ['quran-reflections'] });
    },
  });
};

export const useQuranStreak = () => {
  return useQuery({
    queryKey: ['quran-streak'],
    queryFn: async () => {
      const response = await apiClient.getQuranStreak();
      return response.data as QuranStreak;
    },
  });
};

export const useQuranReflections = () => {
  return useQuery({
    queryKey: ['quran-reflections'],
    queryFn: async () => {
      const response = await apiClient.getQuranReflections();
      return response.data as QuranReflection[];
    },
  });
};

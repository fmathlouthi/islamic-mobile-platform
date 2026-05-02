import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { SubscriptionPlan, UserSubscription } from '@tariq/shared';
import { Alert } from 'react-native';

export const useSubscription = () => {
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery<UserSubscription>({
    queryKey: ['subscription'],
    queryFn: () => apiClient.getSubscription(),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      return apiClient.createCheckoutSession(plan);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      Alert.alert('Checkout', 'Stripe native checkout is not available on web in this app.');
    },
    onError: (error: any) => {
      Alert.alert('Error', error?.message || 'Failed to start checkout');
    },
  });

  const isPremium =
    subscriptionQuery.data?.plan === SubscriptionPlan.PREMIUM ||
    subscriptionQuery.data?.plan === SubscriptionPlan.FAMILY;

  return {
    subscription: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isPremium,
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
  };
};

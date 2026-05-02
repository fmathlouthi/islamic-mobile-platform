import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { SubscriptionPlan, UserSubscription } from '@tariq/shared';
import { useStripe } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';

export const useSubscription = () => {
  const queryClient = useQueryClient();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const subscriptionQuery = useQuery<UserSubscription>({
    queryKey: ['subscription'],
    queryFn: () => apiClient.getSubscription(),
  });

  const checkoutMutation = useMutation({
    mutationFn: async (plan: SubscriptionPlan) => {
      const data = await apiClient.createNativeSubscription(plan);
      
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Tariq ila Al-Jannah',
        customerId: data.customerId,
        customerEphemeralKeySecret: data.ephemeralKey,
        paymentIntentClientSecret: data.clientSecret,
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        throw new Error(initError.message);
      }

      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        throw new Error(presentError.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      Alert.alert('Success', 'Your subscription is now active!');
    },
    onError: (error) => {
      Alert.alert('Error', error.message);
    },
  });

  const isPremium = subscriptionQuery.data?.plan === SubscriptionPlan.PREMIUM || 
                    subscriptionQuery.data?.plan === SubscriptionPlan.FAMILY;

  return {
    subscription: subscriptionQuery.data,
    isLoading: subscriptionQuery.isLoading,
    isPremium,
    checkout: checkoutMutation.mutate,
    isCheckingOut: checkoutMutation.isPending,
  };
};

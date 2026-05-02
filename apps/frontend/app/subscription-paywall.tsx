import React from 'react';
import { SubscriptionPaywall } from '@/components/SubscriptionPaywall';
import { useRouter } from 'expo-router';

export default function SubscriptionPaywallScreen() {
  const router = useRouter();

  return (
    <SubscriptionPaywall 
      onClose={() => router.back()} 
    />
  );
}

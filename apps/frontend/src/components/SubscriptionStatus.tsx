import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { useSubscription } from '../hooks/useSubscription';
import { SubscriptionPlan } from '@tariq/shared';

export const SubscriptionStatus = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { subscription, isPremium } = useSubscription();

  if (!subscription) return null;

  const getPlanName = (plan: SubscriptionPlan) => {
    switch (plan) {
      case SubscriptionPlan.FREE:
        return t('subscription.planFree');
      case SubscriptionPlan.PREMIUM:
        return t('subscription.planPremium');
      case SubscriptionPlan.FAMILY:
        return t('subscription.planFamily');
      default:
        return plan;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.plan}>
          {t('subscription.activePlan', { plan: getPlanName(subscription.plan) })}
        </Text>
        <Text style={styles.status}>
          {t('subscription.status', { status: subscription.status })}
        </Text>
        {subscription.currentPeriodEnd && (
          <Text style={styles.expiry}>
            {t('subscription.expiresAt', { 
              date: new Date(subscription.currentPeriodEnd).toLocaleDateString() 
            })}
          </Text>
        )}
      </View>
      
      {!isPremium && (
        <TouchableOpacity 
          style={styles.upgradeButton}
          onPress={() => router.push('/subscription-paywall')}
        >
          <Text style={styles.upgradeButtonText}>{t('subscription.subscribeNow')}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  info: {
    flex: 1,
  },
  plan: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  status: {
    color: '#aaa',
    fontSize: 14,
  },
  expiry: {
    color: '#888',
    fontSize: 12,
  },
  upgradeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});

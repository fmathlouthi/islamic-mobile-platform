import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Linking,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { SubscriptionPlan } from '@tariq/shared';
import { useSubscription } from '../hooks/useSubscription';

interface Props {
  onClose: () => void;
}

export const SubscriptionPaywall: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const { checkout, isCheckingOut } = useSubscription();

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    checkout(plan);
  };

  const PlanCard = ({ 
    plan, 
    price, 
    features, 
    color 
  }: { 
    plan: SubscriptionPlan, 
    price: string, 
    features: string[], 
    color: string 
  }) => (
    <View style={[styles.planCard, { borderColor: color }]}>
      <Text style={[styles.planName, { color }]}>{plan.toUpperCase()}</Text>
      <Text style={styles.planPrice}>{price}</Text>
      <View style={styles.featuresContainer}>
        {features.map((feature, index) => (
          <Text key={index} style={styles.featureText}>✓ {feature}</Text>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.subscribeButton, { backgroundColor: color }]}
        onPress={() => handleSubscribe(plan)}
        disabled={isCheckingOut}
      >
        <Text style={styles.subscribeButtonText}>
          {isCheckingOut ? t('common.loading') : t('subscription.subscribeNow')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('subscription.upgradeTitle')}</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.subtitle}>{t('subscription.upgradeSubtitle')}</Text>
        
        <PlanCard
          plan={SubscriptionPlan.PREMIUM}
          price="$4.99 / month"
          color="#4CAF50"
          features={[
            t('subscription.featureAiOutfit'),
            t('subscription.featureUnlimitedFiqh'),
            t('subscription.featureNoAds'),
            t('subscription.featureSupportDawah'),
          ]}
        />

        <PlanCard
          plan={SubscriptionPlan.FAMILY}
          price="$9.99 / month"
          color="#2196F3"
          features={[
            t('subscription.featureAllPremium'),
            t('subscription.featureUpTo5Members'),
            t('subscription.featureSharedProgress'),
          ]}
        />

        <TouchableOpacity onPress={onClose} style={styles.maybeLater}>
          <Text style={styles.maybeLaterText}>{t('subscription.maybeLater')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    left: 20,
    padding: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    color: '#aaa',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  planCard: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    borderWidth: 2,
    padding: 20,
    marginBottom: 20,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planPrice: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  subscribeButton: {
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  subscribeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  maybeLater: {
    marginTop: 10,
    padding: 10,
  },
  maybeLaterText: {
    color: '#aaa',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

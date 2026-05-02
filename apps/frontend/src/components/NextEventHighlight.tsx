import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { useTranslation } from 'react-i18next';

export const NextEventHighlight: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const { data: nextEvent, isLoading } = useQuery({
    queryKey: ['next-event'],
    queryFn: () => apiClient.getNextEvent(),
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator color="#4CAF50" />
      </View>
    );
  }

  if (!nextEvent) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{t('calendar.nextEvent')}</Text>
      <View style={styles.content}>
        <View style={styles.eventInfo}>
          <Text style={styles.eventName}>
            {isArabic ? nextEvent.nameAr : nextEvent.nameEn}
          </Text>
          <Text style={styles.eventDate}>
            {nextEvent.gregorianDate}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {nextEvent.daysRemaining} {t('calendar.daysRemaining')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 100,
  },
  label: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventInfo: {
    flex: 1,
  },
  eventName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventDate: {
    fontSize: 14,
    color: '#aaa',
  },
  badge: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

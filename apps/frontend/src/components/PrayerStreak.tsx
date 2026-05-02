import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { usePrayerStreak } from '../hooks/usePrayerTracking';
import { useTranslation } from 'react-i18next';

export const PrayerStreak = () => {
  const { t } = useTranslation();
  const { data: streak, isLoading } = usePrayerStreak();

  if (isLoading || !streak || streak.currentStreak === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.fireIcon}>🔥</Text>
      <View>
        <Text style={styles.count}>{t('prayers.streak', { count: streak.currentStreak })}</Text>
        <Text style={styles.label}>{t('prayers.longestStreak', { count: streak.longestStreak })}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ff9800',
    marginBottom: 16,
    alignSelf: 'center',
  },
  fireIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  count: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  label: {
    color: '#aaa',
    fontSize: 12,
  },
});

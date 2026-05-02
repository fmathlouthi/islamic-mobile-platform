import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useQuranStreak } from '../hooks/useQuran';

export const QuranStreak = () => {
  const { data: streak, isLoading } = useQuranStreak();

  if (isLoading || !streak || streak.currentStreak === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>📖</Text>
      <View>
        <Text style={styles.count}>{streak.currentStreak} Day Streak</Text>
        <Text style={styles.label}>Longest: {streak.longestStreak} days</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a2a1a',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#4caf50',
    marginBottom: 16,
    alignSelf: 'center',
    width: '90%',
  },
  icon: {
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

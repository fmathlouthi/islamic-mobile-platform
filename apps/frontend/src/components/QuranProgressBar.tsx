import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface QuranProgressBarProps {
  progress: number;
  target: number;
  unit: string;
}

export const QuranProgressBar: React.FC<QuranProgressBarProps> = ({ progress, target, unit }) => {
  const percentage = target > 0 ? Math.min(Math.round((progress / target) * 100), 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Daily Progress</Text>
        <Text style={styles.value}>{progress} / {target} {unit}</Text>
      </View>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarForeground, { width: `${percentage}%` }]} />
      </View>
      <Text style={styles.percentage}>{percentage}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 16,
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  value: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#3a3a4e',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  percentage: {
    color: '#aaa',
    fontSize: 12,
    textAlign: 'right',
  },
});

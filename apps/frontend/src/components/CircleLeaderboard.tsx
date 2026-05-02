import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import { CircleLeaderboard as ILeaderboard, CircleProgress } from '@tariq/shared';

interface Props {
  circleId: string;
}

export const CircleLeaderboard: React.FC<Props> = ({ circleId }) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<ILeaderboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'all-time'>('weekly');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCircleLeaderboard(circleId, period);
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [circleId, period]);

  const sendPing = async (targetUserId: string) => {
    try {
      await apiClient.sendCirclePing(circleId, targetUserId);
      Alert.alert(t('circles.pingSent'));
    } catch (error) {
      console.error('Failed to send ping:', error);
    }
  };

  const renderItem = ({ item, index }: { item: CircleProgress; index: number }) => (
    <View style={styles.rankItem}>
      <Text style={styles.rankText}>{index + 1}</Text>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.userStats}>
          P: {item.prayerCount} | Q: {item.quranPages} | D: {item.dhikrCount}
        </Text>
      </View>
      <View style={styles.pointsInfo}>
        <Text style={styles.pointsText}>{item.totalPoints} pts</Text>
        <TouchableOpacity style={styles.pingButton} onPress={() => sendPing(item.userId)}>
          <Text style={styles.pingIcon}>📣</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.periodTabs}>
        {(['daily', 'weekly', 'monthly', 'all-time'] as const).map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.periodTab, period === p && styles.periodTabActive]}
            onPress={() => setPeriod(p)}
          >
            <Text style={[styles.periodTabText, period === p && styles.periodTabTextActive]}>
              {t(`circles.period.${p}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color="#4CAF50" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={leaderboard?.rankings}
          renderItem={renderItem}
          keyExtractor={(item) => item.userId}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('circles.noRankings')}</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  periodTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#1a1a2e',
  },
  periodTab: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  periodTabActive: {
    backgroundColor: '#4CAF50',
  },
  periodTabText: {
    color: '#aaa',
    fontSize: 12,
  },
  periodTabTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a2e',
  },
  rankText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    width: 30,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  userStats: {
    color: '#888',
    fontSize: 12,
  },
  pointsInfo: {
    alignItems: 'flex-end',
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  pingButton: {
    marginTop: 5,
  },
  pingIcon: {
    fontSize: 18,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../api/client';
import { GroupKhatm as IKhatm } from '@tariq/shared';

interface Props {
  circleId: string;
}

export const GroupKhatm: React.FC<Props> = ({ circleId }) => {
  const { t } = useTranslation();
  const [khatms, setKhatms] = useState<IKhatm[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKhatms = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCircleKhatms(circleId);
      setKhatms(response.data);
    } catch (error) {
      console.error('Failed to fetch khatms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKhatms();
  }, [circleId]);

  const claimPart = async (khatmId: string, juzNumber: number) => {
    try {
      await apiClient.claimKhatmPart(khatmId, juzNumber);
      fetchKhatms();
    } catch (error) {
      Alert.alert(t('common.error'), t('circles.claimError'));
    }
  };

  const completePart = async (khatmId: string, juzNumber: number) => {
    try {
      await apiClient.completeKhatmPart(khatmId, juzNumber);
      fetchKhatms();
    } catch (error) {
      Alert.alert(t('common.error'), t('circles.completeError'));
    }
  };

  const createNewKhatm = async () => {
    try {
      await apiClient.createCircleKhatm(circleId, { title: `Khatm ${new Date().toLocaleDateString()}` });
      fetchKhatms();
    } catch (error) {
      Alert.alert(t('common.error'), t('circles.createKhatmError'));
    }
  };

  if (loading) return <ActivityIndicator color="#4CAF50" style={{ flex: 1, marginTop: 20 }} />;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.createButton} onPress={createNewKhatm}>
        <Text style={styles.createButtonText}>+ {t('circles.startNewKhatm')}</Text>
      </TouchableOpacity>

      {khatms.length === 0 ? (
        <Text style={styles.emptyText}>{t('circles.noKhatms')}</Text>
      ) : (
        khatms.map((khatm) => (
          <View key={khatm.id} style={styles.khatmCard}>
            <Text style={styles.khatmTitle}>{khatm.title}</Text>
            <View style={styles.juzGrid}>
              {khatm.parts.map((part) => (
                <TouchableOpacity
                  key={part.id}
                  style={[
                    styles.juzBox,
                    part.isCompleted ? styles.juzCompleted : part.claimedByUserId ? styles.juzClaimed : styles.juzAvailable
                  ]}
                  onPress={() => {
                    if (part.isCompleted) return;
                    if (!part.claimedByUserId) {
                      Alert.alert(
                        t('circles.claimJuz'),
                        `${t('circles.juz')} ${part.juzNumber}`,
                        [
                          { text: t('common.cancel'), style: 'cancel' },
                          { text: t('circles.claim'), onPress: () => claimPart(khatm.id, part.juzNumber) }
                        ]
                      );
                    } else {
                      Alert.alert(
                        t('circles.completeJuz'),
                        `${t('circles.juz')} ${part.juzNumber}`,
                        [
                          { text: t('common.cancel'), style: 'cancel' },
                          { text: t('circles.complete'), onPress: () => completePart(khatm.id, part.juzNumber) }
                        ]
                      );
                    }
                  }}
                >
                  <Text style={styles.juzText}>{part.juzNumber}</Text>
                  {part.claimedByUser && (
                    <Text style={styles.claimedBy} numberOfLines={1}>
                      {part.claimedByUser.name?.split(' ')[0]}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#0f0f1e',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  khatmCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  khatmTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  juzGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  juzBox: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    padding: 2,
  },
  juzAvailable: {
    backgroundColor: '#2a2a3e',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  juzClaimed: {
    backgroundColor: '#3e3e1a',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  juzCompleted: {
    backgroundColor: '#1a3e1a',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  juzText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  claimedBy: {
    color: '#aaa',
    fontSize: 7,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
  },
});

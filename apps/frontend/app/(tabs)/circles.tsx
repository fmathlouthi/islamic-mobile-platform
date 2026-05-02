import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/api/client';
import { CircleLeaderboard } from '../../src/components/CircleLeaderboard';
import { GroupKhatm } from '../../src/components/GroupKhatm';
import { Circle } from '@tariq/shared';

export default function CirclesScreen() {
  const { t } = useTranslation();
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'khatm'>('leaderboard');

  const fetchCircles = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getMyCircles();
      setCircles(response.data || []);
    } catch (error) {
      console.error('Failed to fetch circles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCircles();
  }, []);

  const handleCreateCircle = async () => {
    if (!newCircleName) return;
    try {
      await apiClient.createCircle({ name: newCircleName });
      setShowCreateModal(false);
      setNewCircleName('');
      fetchCircles();
    } catch (error) {
      Alert.alert(t('common.error'), t('circles.createError'));
    }
  };

  const handleJoinCircle = async () => {
    if (!inviteCode) return;
    try {
      await apiClient.joinCircle(inviteCode);
      setShowJoinModal(false);
      setInviteCode('');
      fetchCircles();
    } catch (error) {
      Alert.alert(t('common.error'), t('circles.joinError'));
    }
  };

  const shareInviteCode = async (code: string) => {
    try {
      await Share.share({
        message: `${t('circles.joinTitle')}: ${code}`,
      });
    } catch (error) {
      console.error('Error sharing invite code:', error);
    }
  };

  const renderCircleItem = ({ item }: { item: Circle }) => (
    <TouchableOpacity style={styles.circleCard} onPress={() => setSelectedCircle(item)}>
      <View style={styles.circleInfo}>
        <Text style={styles.circleName}>{item.name}</Text>
        <Text style={styles.memberCount}>{item.membersCount} {t('circles.members')}</Text>
      </View>
      <TouchableOpacity onPress={() => shareInviteCode(item.inviteCode)}>
        <View style={styles.inviteCodeBadge}>
          <Text style={styles.inviteCodeText}>{item.inviteCode}</Text>
        </View>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (selectedCircle) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedCircle(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← {t('common.back') || 'Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{selectedCircle.name}</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'leaderboard' && styles.activeTab]}
            onPress={() => setActiveTab('leaderboard')}
          >
            <Text style={[styles.tabText, activeTab === 'leaderboard' && styles.activeTabText]}>
              {t('circles.leaderboard')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'khatm' && styles.activeTab]}
            onPress={() => setActiveTab('khatm')}
          >
            <Text style={[styles.tabText, activeTab === 'khatm' && styles.activeTabText]}>
              {t('circles.khatm')}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'leaderboard' ? (
          <CircleLeaderboard circleId={selectedCircle.id} />
        ) : (
          <GroupKhatm circleId={selectedCircle.id} />
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={() => setShowJoinModal(true)}>
          <Text style={styles.actionButtonText}>{t('circles.joinTitle')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.createButton]} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.actionButtonText}>{t('circles.createTitle')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#4CAF50" size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={circles}
          renderItem={renderCircleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('circles.noRankings')}</Text>}
        />
      )}

      {/* Join Modal */}
      <Modal visible={showJoinModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('circles.joinTitle')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('circles.inviteCode')}
              placeholderTextColor="#888"
              value={inviteCode}
              onChangeText={setInviteCode}
              autoCapitalize="characters"
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowJoinModal(false)}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleJoinCircle}>
                <Text style={styles.confirmButtonText}>{t('circles.join')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Create Modal */}
      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('circles.createTitle')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('circles.name') || 'Circle Name'}
              placeholderTextColor="#888"
              value={newCircleName}
              onChangeText={setNewCircleName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmButton, { backgroundColor: '#4CAF50' }]} onPress={handleCreateCircle}>
                <Text style={styles.confirmButtonText}>{t('circles.create')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 0.48,
    backgroundColor: '#2a2a3e',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    backgroundColor: '#1a3e1a',
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContent: {
    padding: 15,
  },
  circleCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleInfo: {
    flex: 1,
  },
  circleName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberCount: {
    color: '#888',
    marginTop: 5,
  },
  inviteCodeBadge: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  inviteCodeText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 12,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1a2e',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    color: '#888',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#4CAF50',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#0f0f1e',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 0.45,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
  },
  confirmButton: {
    flex: 0.45,
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
});

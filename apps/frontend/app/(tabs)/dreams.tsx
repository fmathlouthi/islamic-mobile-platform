import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { apiClient } from '../../src/api/client';
import { Dream, DreamMood } from '@tariq/shared';

export default function DreamsScreen() {
  const { t } = useTranslation();
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newDream, setNewDream] = useState({ title: '', description: '', mood: DreamMood.PEACEFUL });
  const [interpreting, setInterpreting] = useState(false);

  const fetchDreams = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getDreams();
      setDreams(response || []);
    } catch (error) {
      console.error('Failed to fetch dreams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  const handleCreateDream = async () => {
    if (!newDream.title || !newDream.description) {
      Alert.alert(t('common.error'), t('common.allFieldsRequired') || 'All fields are required');
      return;
    }
    try {
      await apiClient.createDream(newDream);
      setShowCreateModal(false);
      setNewDream({ title: '', description: '', mood: DreamMood.PEACEFUL });
      fetchDreams();
    } catch (error) {
      Alert.alert(t('common.error'), t('common.errorOccurred') || 'An error occurred');
    }
  };

  const handleInterpret = async (id: string) => {
    setInterpreting(true);
    try {
      const response = await apiClient.interpretDream(id);
      setSelectedDream(response);
      // Update the dream in the list as well
      setDreams(dreams.map(d => d.id === id ? response : d));
    } catch (error) {
      Alert.alert(t('common.error'), t('fiqh.error'));
    } finally {
      setInterpreting(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert(
      t('common.confirm') || 'Confirm',
      t('dreams.deleteConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete') || 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await apiClient.deleteDream(id);
              if (selectedDream?.id === id) setSelectedDream(null);
              setDreams(dreams.filter(d => d.id !== id));
            } catch (error) {
              Alert.alert(t('common.error'), t('common.errorOccurred') || 'An error occurred');
            }
          }
        }
      ]
    );
  };

  const renderDreamItem = ({ item }: { item: Dream }) => (
    <TouchableOpacity style={styles.dreamCard} onPress={() => setSelectedDream(item)}>
      <View style={styles.dreamHeader}>
        <Text style={styles.dreamTitle}>{item.title}</Text>
        <Text style={styles.dreamMood}>{t(`dreams.moods.${item.mood}`)}</Text>
      </View>
      <Text style={styles.dreamDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.dreamPreview} numberOfLines={2}>{item.description}</Text>
      {item.interpretation && (
        <View style={styles.interpretedBadge}>
          <Text style={styles.interpretedText}>{t('dreams.interpretation')}</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (selectedDream) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSelectedDream(null)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← {t('common.back') || 'Back'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(selectedDream.id)} style={styles.deleteButton}>
             <Text style={styles.deleteButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>{selectedDream.title}</Text>
          <View style={styles.detailInfo}>
            <Text style={styles.detailMood}>{t('dreams.mood')}: {t(`dreams.moods.${selectedDream.mood}`)}</Text>
            <Text style={styles.detailDate}>{new Date(selectedDream.createdAt).toLocaleString()}</Text>
          </View>
          
          <Text style={styles.sectionTitle}>{t('dreams.description')}</Text>
          <Text style={styles.detailDescription}>{selectedDream.description}</Text>

          {selectedDream.interpretation ? (
            <View style={styles.interpretationSection}>
              <Text style={styles.sectionTitle}>{t('dreams.interpretation')}</Text>
              <Text style={styles.interpretationText}>{selectedDream.interpretation}</Text>
              <Text style={styles.disclaimer}>{t('dreams.disclaimer')}</Text>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.interpretButton} 
              onPress={() => handleInterpret(selectedDream.id)}
              disabled={interpreting}
            >
              {interpreting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.interpretButtonText}>{t('dreams.interpret')}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('dreams.title')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowCreateModal(true)}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color="#4CAF50" size="large" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={dreams}
          renderItem={renderDreamItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>{t('dreams.noDreams')}</Text>}
        />
      )}

      <Modal visible={showCreateModal} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('dreams.newDream')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('dreams.dreamTitle')}
              placeholderTextColor="#888"
              value={newDream.title}
              onChangeText={(text) => setNewDream({ ...newDream, title: text })}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('dreams.description')}
              placeholderTextColor="#888"
              value={newDream.description}
              onChangeText={(text) => setNewDream({ ...newDream, description: text })}
              multiline
              numberOfLines={4}
            />
            
            <Text style={styles.label}>{t('dreams.mood')}</Text>
            <View style={styles.moodContainer}>
              {Object.values(DreamMood).map((mood) => (
                <TouchableOpacity
                  key={mood}
                  style={[styles.moodItem, newDream.mood === mood && styles.moodItemSelected]}
                  onPress={() => setNewDream({ ...newDream, mood })}
                >
                  <Text style={[styles.moodText, newDream.mood === mood && styles.moodTextSelected]}>
                    {t(`dreams.moods.${mood}`)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleCreateDream}>
                <Text style={styles.confirmButtonText}>{t('common.save')}</Text>
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
    padding: 20,
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 15,
  },
  dreamCard: {
    backgroundColor: '#1a1a2e',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  dreamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dreamTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  dreamMood: {
    color: '#4CAF50',
    fontSize: 12,
    backgroundColor: '#1a3e1a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 10,
  },
  dreamDate: {
    color: '#888',
    fontSize: 12,
    marginTop: 5,
  },
  dreamPreview: {
    color: '#ccc',
    marginTop: 10,
    fontSize: 14,
  },
  interpretedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 5,
    marginTop: 10,
  },
  interpretedText: {
    color: '#4CAF50',
    fontSize: 10,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 20,
  },
  detailCard: {
    padding: 20,
  },
  detailTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detailInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailMood: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  detailDate: {
    color: '#888',
  },
  sectionTitle: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  detailDescription: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 24,
  },
  interpretationSection: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#2a2a3e',
  },
  interpretationText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  disclaimer: {
    color: '#888',
    fontSize: 12,
    marginTop: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  interpretButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  interpretButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
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
    marginBottom: 15,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    color: '#888',
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  moodItem: {
    backgroundColor: '#2a2a3e',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  moodItemSelected: {
    backgroundColor: '#4CAF50',
  },
  moodText: {
    color: '#ccc',
    fontSize: 12,
  },
  moodTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
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
});

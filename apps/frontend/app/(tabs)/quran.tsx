import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useQuranGoals, useCreateQuranGoal, useQuranProgress, useLogQuranProgress, useQuranReflections } from '../../src/hooks';
import { QuranStreak } from '../../src/components/QuranStreak';
import { QuranProgressBar } from '../../src/components/QuranProgressBar';
import { QuranGoalType, QuranGoalFrequency } from '@tariq/shared';

export default function QuranScreen() {
  const { data: goals } = useQuranGoals();
  const { data: progressList } = useQuranProgress();
  const { data: reflections } = useQuranReflections();
  
  const logProgressMutation = useLogQuranProgress();
  const createGoalMutation = useCreateQuranGoal();

  const [modalVisible, setModalVisible] = useState(false);
  const [surah, setSurah] = useState('');
  const [startAyah, setStartAyah] = useState('');
  const [endAyah, setEndAyah] = useState('');
  const [pages, setPages] = useState('');

  const handleLogProgress = () => {
    if (!surah || !startAyah || !endAyah || !pages) return;

    logProgressMutation.mutate({
      surahNumber: parseInt(surah),
      ayahStart: parseInt(startAyah),
      ayahEnd: parseInt(endAyah),
      pagesRead: parseFloat(pages),
      date: new Date().toISOString().split('T')[0],
      goalId: goals && goals.length > 0 ? goals[0].id : undefined,
    });
    setModalVisible(false);
    setSurah('');
    setStartAyah('');
    setEndAyah('');
    setPages('');
  };

  const activeGoal = goals && goals.length > 0 ? goals[0] : null;
  const todayProgress = progressList ? progressList
    .filter(p => p.date === new Date().toISOString().split('T')[0])
    .reduce((acc, curr) => acc + curr.pagesRead, 0) : 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <QuranStreak />

      {activeGoal ? (
        <QuranProgressBar 
          progress={todayProgress} 
          target={activeGoal.targetAmount} 
          unit={activeGoal.targetUnit} 
        />
      ) : (
        <View style={styles.noGoalContainer}>
          <Text style={styles.noGoalText}>No active reading goal</Text>
          <TouchableOpacity 
            style={styles.createGoalButton}
            onPress={() => {
              createGoalMutation.mutate({
                type: QuranGoalType.READING,
                frequency: QuranGoalFrequency.DAILY,
                targetAmount: 5,
                targetUnit: 'pages',
              });
            }}
          >
            <Text style={styles.createGoalButtonText}>Set Daily Goal (5 pages)</Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity 
        style={styles.logButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.logButtonText}>Log Reading Progress</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>AI Spiritual Reflections</Text>
      {reflections && reflections.length > 0 ? (
        reflections.map(reflection => (
          <View key={reflection.id} style={styles.reflectionCard}>
            <Text style={styles.reflectionContext}>{reflection.verseContext}</Text>
            <Text style={styles.reflectionContent}>{reflection.content}</Text>
            <Text style={styles.reflectionDate}>
              {new Date(reflection.createdAt).toLocaleDateString()}
            </Text>
          </View>
        ))
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>No reflections yet. Log your reading to get AI-powered insights!</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Recent Progress</Text>
      {progressList && progressList.length > 0 ? (
        progressList.map(progress => (
          <View key={progress.id} style={styles.progressItem}>
            <View>
              <Text style={styles.progressText}>
                Surah {progress.surahNumber}: {progress.ayahStart}-{progress.ayahEnd}
              </Text>
              <Text style={styles.progressSubtext}>
                {progress.pagesRead} pages
              </Text>
            </View>
            <Text style={styles.progressDate}>{progress.date}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.emptyText}>No progress logged yet.</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Reading</Text>
            <TextInput
              style={styles.input}
              placeholder="Surah Number"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={surah}
              onChangeText={setSurah}
            />
            <TextInput
              style={styles.input}
              placeholder="Start Ayah"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={startAyah}
              onChangeText={setStartAyah}
            />
            <TextInput
              style={styles.input}
              placeholder="End Ayah"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={endAyah}
              onChangeText={setEndAyah}
            />
            <TextInput
              style={styles.input}
              placeholder="Pages Read"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={pages}
              onChangeText={setPages}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleLogProgress}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  noGoalContainer: {
    padding: 24,
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  noGoalText: {
    color: '#aaa',
    fontSize: 16,
    marginBottom: 16,
  },
  createGoalButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createGoalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  logButton: {
    backgroundColor: '#3f51b5',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  logButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reflectionCard: {
    backgroundColor: '#2a2a3e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#4caf50',
  },
  reflectionContext: {
    color: '#4caf50',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  reflectionContent: {
    color: '#fff',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    textAlign: 'right',
  },
  reflectionDate: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
  },
  emptyCard: {
    backgroundColor: '#2a2a3e',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  progressItem: {
    backgroundColor: '#252538',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  progressSubtext: {
    color: '#aaa',
    fontSize: 14,
  },
  progressDate: {
    color: '#666',
    fontSize: 12,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#1a1a2e',
    padding: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#2a2a3e',
    color: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  modalButton: {
    flex: 0.45,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#444',
  },
  saveButton: {
    backgroundColor: '#4caf50',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

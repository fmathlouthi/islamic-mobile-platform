import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { useWuduGuide } from '@/hooks/useWudu';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function WuduGuideScreen() {
  const { data: steps, isLoading } = useWuduGuide();
  const { t } = useTranslation();
  const router = useRouter();

  const renderStep = ({ item }: { item: any }) => (
    <View style={styles.stepCard}>
      <View style={styles.stepHeader}>
        <View style={styles.stepNumber}>
          <Text style={styles.stepNumberText}>{item.id}</Text>
        </View>
        <View>
          <Text style={styles.stepTitleAr}>{item.arabicTitle}</Text>
          <Text style={styles.stepTitle}>{item.title}</Text>
        </View>
      </View>
      <Image source={{ uri: item.imageUrl }} style={styles.stepImage} />
      <Text style={styles.stepDescription}>{item.description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← {t('common.cancel')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('prayers.wuduGuideTitle')}</Text>
      </View>
      
      {isLoading ? (
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      ) : (
        <FlatList
          data={steps}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderStep}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  stepCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepNumber: {
    backgroundColor: '#4CAF50',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  stepTitleAr: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
  },
  stepTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  stepImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#1a1a2e',
  },
  stepDescription: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  loadingText: {
    color: '#fff',
    textAlign: 'center',
    marginTop: 20,
  },
});

import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAthkarCategories } from '@/hooks/useAthkar';
import { AthkarCategory } from '@tariq/shared';

const CATEGORY_ICONS: Record<string, string> = {
  morning: '🌅',
  evening: '🌆',
  sleep: '🌙',
  wake_up: '⏰',
  prayer: '🤲',
  quran: '📖',
};

const CATEGORY_COLORS: Record<string, string> = {
  morning: '#FF9800',
  evening: '#9C27B0',
  sleep: '#3F51B5',
  wake_up: '#009688',
  prayer: '#4CAF50',
  quran: '#795548',
};

export default function AthkarScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: categories, isLoading } = useAthkarCategories();

  const handleCategoryPress = (category: string) => {
    router.push(`/athkar/${category}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('athkar.title')}</Text>
        <Text style={styles.subtitle}>{t('athkar.subtitle')}</Text>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.category}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryCard,
              { borderLeftColor: CATEGORY_COLORS[item.category] || '#4CAF50' },
            ]}
            onPress={() => handleCategoryPress(item.category)}
          >
            <View style={styles.categoryIcon}>
              <Text style={styles.iconText}>
                {CATEGORY_ICONS[item.category] || '📿'}
              </Text>
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryNameAr}>{item.nameAr}</Text>
              <Text style={styles.categoryNameEn}>{item.nameEn}</Text>
              <Text style={styles.itemCount}>
                {item.itemCount} {t('athkar.items')}
              </Text>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#aaa',
    fontSize: 16,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  categoryCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 24,
  },
  categoryContent: {
    flex: 1,
  },
  categoryNameAr: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  categoryNameEn: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 12,
    color: '#666',
  },
  arrow: {
    fontSize: 24,
    color: '#666',
  },
});

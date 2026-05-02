import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { PrayerStreak } from '@/components/PrayerStreak';
import { NextEventHighlight } from '@/components/NextEventHighlight';

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.bismillah}>بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</Text>
          <Text style={styles.title}>{t('home.welcome')}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        <PrayerStreak />

        <NextEventHighlight />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>{t('home.duaOfTheDay')}</Text>
          <Text style={styles.arabicText}>
            رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ
          </Text>
          <Text style={styles.translation}>
            "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire."
          </Text>
          <Text style={styles.source}>- Surah Al-Baqarah (2:201)</Text>
        </View>

        <View style={styles.features}>
          <Text style={styles.sectionTitle}>{t('home.features')}</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🕌</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{t('home.prayerTimes')}</Text>
              <Text style={styles.featureDesc}>{t('home.prayerTimesDesc')}</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📿</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{t('home.athkar')}</Text>
              <Text style={styles.featureDesc}>{t('home.athkarDesc')}</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📖</Text>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{t('home.quran')}</Text>
              <Text style={styles.featureDesc}>{t('home.quranDesc')}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  bismillah: {
    fontSize: 20,
    color: '#4CAF50',
    marginBottom: 16,
    textAlign: 'center',
    fontFamily: 'System',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 12,
    textAlign: 'center',
  },
  arabicText: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
    fontFamily: 'System',
  },
  translation: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  source: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  features: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 16,
  },
  featureItem: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#aaa',
  },
});

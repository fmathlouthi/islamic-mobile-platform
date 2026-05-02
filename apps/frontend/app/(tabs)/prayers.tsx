import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { usePrayerTimes } from '@/hooks/usePrayerTimes';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useCompletePrayer } from '@/hooks/usePrayerTracking';
import { PrayerName, PRAYER_NAMES_AR, PRAYER_NAMES_EN } from '@tariq/shared';
import { PrayerStreak } from '@/components/PrayerStreak';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
import { useEffect } from 'react';

export default function PrayersScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: prayerTimes, isLoading, error } = usePrayerTimes();
  const { user } = useAuthStore();
  const { mutate: completePrayer } = useCompletePrayer();
  const { scheduleLocalAdhanNotification, cancelAllNotifications } = useNotifications();

  useEffect(() => {
    if (prayerTimes && user?.prayerTimeNotifications) {
      (prayerTimes.prayers as any[]).forEach((prayer: any) => {
        if (prayer.name === PrayerName.SUNRISE) return;
        
        const [hours, minutes] = prayer.time.split(':').map(Number);
        const prayerDate = new Date();
        prayerDate.setHours(hours, minutes, 0, 0);
        
        if (prayerDate > new Date()) {
          scheduleLocalAdhanNotification(
            PRAYER_NAMES_AR[prayer.name as PrayerName], 
            prayerDate,
            `adhan-${prayerTimes.date}-${prayer.name}`
          );
        }
      });
    } else if (user?.prayerTimeNotifications === false) {
      cancelAllNotifications();
    }
  }, [prayerTimes, user?.prayerTimeNotifications]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Loading prayer times...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>🕌</Text>
          <Text style={styles.errorTitle}>Unable to load prayer times</Text>
          <Text style={styles.errorText}>
            {user?.latitude && user?.longitude
              ? 'Please update your location in settings'
              : 'Please set your location in settings'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!prayerTimes) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorIcon}>📍</Text>
          <Text style={styles.errorTitle}>No Location Set</Text>
          <Text style={styles.errorText}>
            Please set your location to see prayer times
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleComplete = (prayerName: PrayerName) => {
    completePrayer({ prayerName, date: prayerTimes.date });
  };

  const currentPrayerIndex = (prayerTimes.prayers as any[]).findIndex((prayer: any) => {
    const now = new Date();
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTime = new Date();
    prayerTime.setHours(hours, minutes, 0, 0);
    return now < prayerTime;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.date}>{prayerTimes.date}</Text>
          <Text style={styles.locationText}>
            📍 {user?.latitude?.toFixed(4)}, {user?.longitude?.toFixed(4)}
          </Text>
        </View>

        <PrayerStreak />

        <TouchableOpacity 
          style={styles.wuduButton}
          onPress={() => router.push('/wudu-guide')}
        >
          <Text style={styles.wuduButtonText}>🚿 {t('prayers.wuduGuide')}</Text>
        </TouchableOpacity>

        <View style={styles.actionButtonsRow}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/location/qibla')}
          >
            <Text style={styles.actionButtonText}>🧭 {t('prayers.qiblaFinder')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/location/mosques')}
          >
            <Text style={styles.actionButtonText}>🕌 {t('prayers.nearbyMosques')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.prayerList}>
          {(prayerTimes.prayers as any[]).map((prayer: any, index: number) => {
            const isNext = index === currentPrayerIndex;
            const isPast = index < (currentPrayerIndex === -1 ? prayerTimes.prayers.length : currentPrayerIndex);

            return (
              <View
                key={prayer.name}
                style={[
                  styles.prayerCard,
                  isNext && styles.prayerCardNext,
                  isPast && styles.prayerCardPast,
                ]}
              >
                {isNext && (
                  <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>NEXT</Text>
                  </View>
                )}
                <View style={styles.prayerInfo}>
                  <Text style={styles.prayerName}>
                    {PRAYER_NAMES_AR[prayer.name as PrayerName]}
                  </Text>
                  <Text style={styles.prayerNameEn}>
                    {PRAYER_NAMES_EN[prayer.name as PrayerName]}
                  </Text>
                </View>
                <View style={styles.timeAndAction}>
                  <Text
                    style={[
                      styles.prayerTime,
                      isNext && styles.prayerTimeNext,
                      isPast && styles.prayerTimePast,
                    ]}
                  >
                    {prayer.time}
                  </Text>
                  <TouchableOpacity
                    style={styles.completeButton}
                    onPress={() => handleComplete(prayer.name)}
                  >
                    <Text style={styles.completeIcon}>✅</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.methodInfo}>
          <Text style={styles.methodLabel}>Calculation Method:</Text>
          <Text style={styles.methodValue}>{prayerTimes.calculationMethod}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#aaa',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  date: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#666',
  },
  prayerList: {
    gap: 12,
  },
  prayerCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  prayerCardNext: {
    backgroundColor: '#1e4d2b',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  prayerCardPast: {
    opacity: 0.5,
  },
  nextBadge: {
    position: 'absolute',
    top: -8,
    left: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nextBadgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 2,
  },
  prayerNameEn: {
    fontSize: 14,
    color: '#aaa',
  },
  prayerTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  prayerTimeNext: {
    color: '#4CAF50',
  },
  prayerTimePast: {
    color: '#666',
  },
  methodInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  methodLabel: {
    fontSize: 14,
    color: '#666',
  },
  methodValue: {
    fontSize: 14,
    color: '#aaa',
  },
  wuduButton: {
    backgroundColor: '#2a2a3e',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  wuduButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2a2a3e',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#4CAF50',
    fontWeight: '600',
    fontSize: 14,
  },
  timeAndAction: {
    alignItems: 'flex-end',
  },
  completeButton: {
    marginTop: 8,
    padding: 4,
  },
  completeIcon: {
    fontSize: 20,
  },
});

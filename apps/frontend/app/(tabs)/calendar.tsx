import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { apiClient } from '@/api/client';
import { IslamicEvent, HIJRI_MONTHS_EN, HIJRI_MONTHS_AR } from '@tariq/shared';
import moment from 'moment-hijri';

export default function CalendarScreen() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: events, isLoading } = useQuery({
    queryKey: ['calendar-events', selectedYear],
    queryFn: () => apiClient.getCalendarEvents(selectedYear),
  });

  const now = moment();
  const hijriDate = {
    day: now.iDate(),
    month: now.iMonth() + 1,
    year: now.iYear(),
    monthNameEn: HIJRI_MONTHS_EN[now.iMonth()],
    monthNameAr: HIJRI_MONTHS_AR[now.iMonth()],
  };

  const renderEvent = ({ item }: { item: IslamicEvent }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventMain}>
        <Text style={styles.eventTitle}>
          {isArabic ? item.nameAr : item.nameEn}
        </Text>
        <Text style={styles.eventGregorian}>
          {item.gregorianDate}
        </Text>
        <Text style={styles.eventHijri}>
          {item.hijriDay} {isArabic ? HIJRI_MONTHS_AR[item.hijriMonth - 1] : HIJRI_MONTHS_EN[item.hijriMonth - 1]}
        </Text>
      </View>
      {item.daysRemaining !== undefined && item.daysRemaining >= 0 && (
        <View style={styles.daysRemainingBadge}>
          <Text style={styles.daysRemainingText}>
            {item.daysRemaining} {t('calendar.days')}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.hijriCard}>
          <Text style={styles.hijriDay}>{hijriDate.day}</Text>
          <Text style={styles.hijriMonth}>
            {isArabic ? hijriDate.monthNameAr : hijriDate.monthNameEn}
          </Text>
          <Text style={styles.hijriYear}>{hijriDate.year} AH</Text>
        </View>
        <Text style={styles.gregorianDate}>
          {now.format('LL')}
        </Text>
      </View>

      <View style={styles.eventsSection}>
        <Text style={styles.sectionTitle}>{t('calendar.upcomingEvents')}</Text>
        {isLoading ? (
          <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={events}
            keyExtractor={(item) => item.id}
            renderItem={renderEvent}
            contentContainerStyle={styles.eventsList}
            ListEmptyComponent={
              <Text style={styles.emptyText}>{t('calendar.noEvents')}</Text>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#2a2a3e',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  hijriCard: {
    alignItems: 'center',
    marginBottom: 8,
  },
  hijriDay: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  hijriMonth: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  hijriYear: {
    fontSize: 16,
    color: '#aaa',
    marginTop: 4,
  },
  gregorianDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 12,
  },
  eventsSection: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  eventsList: {
    paddingBottom: 20,
  },
  eventCard: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  eventMain: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  eventGregorian: {
    fontSize: 14,
    color: '#4CAF50',
  },
  eventHijri: {
    fontSize: 12,
    color: '#aaa',
  },
  daysRemainingBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 12,
  },
  daysRemainingText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
  },
});

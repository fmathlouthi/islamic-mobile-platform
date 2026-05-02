import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNearbyMosques } from '../../src/hooks/useLocationFeatures';
import { Mosque } from '@tariq/shared';

type Coords = { latitude: number; longitude: number };

export default function MosqueDiscoveryWebScreen() {
  const { t } = useTranslation();
  const [coords, setCoords] = useState<Coords | null>(null);

  const { data: mosques = [], isLoading } = useNearbyMosques(
    coords?.latitude,
    coords?.longitude
  );

  useEffect(() => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        // keep screen usable even when location is blocked
      }
    );
  }, []);

  const openInMaps = (mosque: Mosque) => {
    const query = encodeURIComponent(`${mosque.name} ${mosque.latitude},${mosque.longitude}`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('prayers.nearbyMosques') }} />

      <Text style={styles.webNotice}>{t('prayers.nearbyMosques')} (Web list view)</Text>

      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlatList
          data={mosques}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.details}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.address}>{item.address || t('prayers.addressNotAvailable')}</Text>
              </View>
              <TouchableOpacity onPress={() => openInMaps(item)}>
                <Ionicons name="navigate-circle" size={34} color="#007AFF" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.empty}>{t('prayers.noMosques')}</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  webNotice: { padding: 12, color: '#8E8E93', textAlign: 'center' },
  list: { padding: 12 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  details: { flex: 1, marginRight: 8 },
  name: { fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  address: { color: '#8E8E93', fontSize: 12 },
  empty: { textAlign: 'center', color: '#8E8E93', marginTop: 30 },
});

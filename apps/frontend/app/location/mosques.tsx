import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, Linking, Platform, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useNearbyMosques } from '../../src/hooks/useLocationFeatures';
import { Mosque } from '@tariq/shared';

const { width } = Dimensions.get('window');

export default function MosqueDiscoveryScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedMosque, setSelectedMosque] = useState<Mosque | null>(null);

  const { data: mosques = [], isLoading: loading } = useNearbyMosques(
    location?.coords.latitude,
    location?.coords.longitude
  );

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      try {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        console.error('Error getting location', error);
      }
    })();
  }, []);

  const openInMaps = (mosque: Mosque) => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${mosque.latitude},${mosque.longitude}`;
    const label = mosque.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const renderMosqueItem = ({ item }: { item: Mosque }) => (
    <TouchableOpacity 
      style={[styles.mosqueCard, selectedMosque?.id === item.id && styles.selectedCard]}
      onPress={() => {
        setSelectedMosque(item);
        mapRef.current?.animateToRegion({
          latitude: item.latitude,
          longitude: item.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }}
    >
      <View style={styles.mosqueInfo}>
        <Text style={styles.mosqueName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.mosqueAddress} numberOfLines={1}>{item.address || t('prayers.addressNotAvailable')}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Ionicons name="walk" size={16} color="#8E8E93" />
            <Text style={styles.statText}>{item.distance ? (item.distance / 1000).toFixed(1) : '?'} km</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={16} color="#8E8E93" />
            <Text style={styles.statText}>{item.travelTime} min</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.directionsButton} onPress={() => openInMaps(item)}>
        <Ionicons name="navigate-circle" size={40} color="#007AFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('prayers.nearbyMosques') }} />
      
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          showsUserLocation
        >
          {mosques.map((mosque) => (
            <Marker
              key={mosque.id}
              coordinate={{ latitude: mosque.latitude, longitude: mosque.longitude }}
              title={mosque.name}
              onPress={() => setSelectedMosque(mosque)}
            >
              <View style={styles.markerContainer}>
                <Ionicons name="business" size={24} color="#34C759" />
              </View>
            </Marker>
          ))}
        </MapView>
      ) : (
        <View style={styles.mapPlaceholder}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {loading ? (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>{t('prayers.findingMosques')}</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={mosques}
            renderItem={renderMosqueItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8 + 20}
            decelerationRate="fast"
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('prayers.noMosques')}</Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerContainer: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#34C759',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  listContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
  },
  listContent: {
    paddingHorizontal: 10,
  },
  mosqueCard: {
    backgroundColor: '#fff',
    width: width * 0.8,
    marginHorizontal: 10,
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  selectedCard: {
    borderColor: '#007AFF',
    borderWidth: 2,
  },
  mosqueInfo: {
    flex: 1,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  mosqueAddress: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    fontSize: 12,
    color: '#8E8E93',
    marginLeft: 4,
  },
  directionsButton: {
    marginLeft: 10,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#8E8E93',
    fontSize: 16,
  },
  emptyContainer: {
    width: width - 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#8E8E93',
    fontSize: 16,
  },
});

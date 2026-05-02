import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import { Magnetometer } from 'expo-sensors';
import * as Location from 'expo-location';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useQibla } from '../../src/hooks/useLocationFeatures';

const { width, height } = Dimensions.get('window');

export default function QiblaFinderScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [heading, setHeading] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);

  const { data: qiblaData } = useQibla(location?.latitude, location?.longitude);
  const qiblaDirection = qiblaData?.direction ?? null;

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      setHasLocationPermission(locationStatus === 'granted');

      if (locationStatus === 'granted') {
        const loc = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      }
    })();

    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    setSubscription(
      Magnetometer.addListener((data) => {
        // Calculate heading from magnetometer data
        let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
        angle = (angle + 360) % 360;
        setHeading(Math.round(angle));
      })
    );
    Magnetometer.setUpdateInterval(100);
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  if (hasCameraPermission === null || hasLocationPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Requesting permissions...</Text>
      </View>
    );
  }

  if (hasCameraPermission === false || hasLocationPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="alert-circle" size={64} color="#FF3B30" />
        <Text style={styles.errorText}>No access to camera or location</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Calculate relative angle for the arrow
  // Qibla direction is degrees from North
  // Magnetometer heading needs to be adjusted based on device orientation
  // This is a simplified version
  const relativeAngle = qiblaDirection !== null ? (qiblaDirection - heading + 360) % 360 : 0;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: t('prayers.qiblaFinder'), headerShown: false }} />
      
      <Camera style={styles.camera} type="back">
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t('prayers.qiblaFinder')}</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.compassContainer}>
            <View style={[styles.arrowWrapper, { transform: [{ rotate: `${relativeAngle}deg` }] }]}>
              <Ionicons name="navigate" size={150} color="#34C759" />
              <View style={styles.kaabaIcon}>
                <Ionicons name="business" size={40} color="#fff" />
              </View>
            </View>
            <Text style={styles.qiblaLabel}>{t('prayers.qibla').toUpperCase()}</Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('prayers.heading')}</Text>
                <Text style={styles.infoValue}>{heading}°</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>{t('prayers.qibla')}</Text>
                <Text style={styles.infoValue}>{qiblaDirection?.toFixed(1)}°</Text>
              </View>
            </View>
            <Text style={styles.instructionText}>
              {t('prayers.horizontalInstruction')}
            </Text>
          </View>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'space-between',
    paddingVertical: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  compassContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  kaabaIcon: {
    position: 'absolute',
    top: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qiblaLabel: {
    color: '#34C759',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
    letterSpacing: 2,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    color: '#EBEBF5',
    fontSize: 12,
    marginBottom: 5,
    opacity: 0.6,
  },
  infoValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  instructionText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#8E8E93',
  },
  errorText: {
    fontSize: 18,
    color: '#3A3A3C',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

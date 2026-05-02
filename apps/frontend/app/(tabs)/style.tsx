import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { apiClient } from '../../src/api/client';
import { OutfitSuggestion } from '@tariq/shared';
import { useTranslation } from 'react-i18next';

export default function StyleScreen() {
  const { t } = useTranslation();
  const [suggestion, setSuggestion] = useState<OutfitSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSuggestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.getOutfitSuggestion();
      setSuggestion(data);
    } catch (err) {
      console.error(err);
      setError(t('style.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuggestion();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{t('style.title')}</Text>
      <Text style={styles.subtitle}>{t('style.subtitle')}</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>{t('style.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={fetchSuggestion}>
            <Text style={styles.buttonText}>{t('style.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : suggestion ? (
        <View style={styles.suggestionContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{suggestion.title}</Text>
            <Text style={styles.cardDescription}>{suggestion.description}</Text>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('style.itemsTitle')}</Text>
              {suggestion.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>• {item}</Text>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('style.colorsTitle')}</Text>
              <Text style={styles.itemText}>{suggestion.colors.join('، ')}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('style.fabricsTitle')}</Text>
              <Text style={styles.itemText}>{suggestion.fabrics.join('، ')}</Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{t('style.whyTitle')}</Text>
              <Text style={styles.infoText}>🌡️ {suggestion.weatherAwareReason}</Text>
              <Text style={styles.infoText}>⚖️ {suggestion.fiqhAwareReason}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={fetchSuggestion}>
            <Text style={styles.buttonText}>{t('style.refresh')}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 30,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: '#ff5252',
    marginBottom: 20,
    textAlign: 'center',
  },
  suggestionContainer: {
    width: '100%',
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'right',
  },
  cardDescription: {
    fontSize: 16,
    color: '#ddd',
    marginBottom: 20,
    textAlign: 'right',
    lineHeight: 24,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'right',
  },
  itemText: {
    fontSize: 16,
    color: '#bbb',
    textAlign: 'right',
  },
  infoBox: {
    backgroundColor: '#162447',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 10,
    textAlign: 'right',
  },
  infoText: {
    fontSize: 14,
    color: '#eee',
    marginBottom: 5,
    textAlign: 'right',
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

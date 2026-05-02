import { Redirect } from 'expo-router';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuthStore } from '@/hooks/useAuthStore';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (!isLoading) {
    return <Redirect href={isAuthenticated ? '/(tabs)/prayers' : '/auth/login'} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>طريق إلى الجنة</Text>
        <Text style={styles.subtitle}>Tariq ila Al-Jannah</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#aaa',
    textAlign: 'center',
  },
});

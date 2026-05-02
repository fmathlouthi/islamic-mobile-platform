import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { View, Text, StyleSheet } from 'react-native';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const icons: Record<string, string> = {
    home: '🏠',
    prayers: '🕌',
    athkar: '📿',
    calendar: '📅',
    fiqh: '⚖️',
    quran: '📖',
    style: '👕',
    charity: '💰',
    circles: '👥',
    dreams: '💭',
    settings: '⚙️',
  };

  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.icon, focused && styles.iconFocused]}>
        {icons[name] || '•'}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1a1a2e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#2a2a3e',
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="prayers"
        options={{
          title: t('tabs.prayers'),
          tabBarIcon: ({ focused }) => <TabIcon name="prayers" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="athkar"
        options={{
          title: t('tabs.athkar'),
          tabBarIcon: ({ focused }) => <TabIcon name="athkar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: t('tabs.calendar'),
          tabBarIcon: ({ focused }) => <TabIcon name="calendar" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="fiqh"
        options={{
          title: 'Fiqh',
          tabBarIcon: ({ focused }) => <TabIcon name="fiqh" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="quran"
        options={{
          title: 'Quran',
          tabBarIcon: ({ focused }) => <TabIcon name="quran" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="style"
        options={{
          title: t('tabs.style'),
          tabBarIcon: ({ focused }) => <TabIcon name="style" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="charity"
        options={{
          title: t('tabs.charity'),
          tabBarIcon: ({ focused }) => <TabIcon name="charity" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="circles"
        options={{
          title: t('tabs.circles'),
          tabBarIcon: ({ focused }) => <TabIcon name="circles" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="dreams"
        options={{
          title: t('tabs.dreams'),
          tabBarIcon: ({ focused }) => <TabIcon name="dreams" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ focused }) => <TabIcon name="settings" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
    opacity: 0.6,
  },
  iconFocused: {
    opacity: 1,
  },
});

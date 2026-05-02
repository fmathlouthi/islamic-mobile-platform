import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Language, Theme, Madhab, Dialect, Gender } from '@tariq/shared';
import { SubscriptionStatus } from '@/components/SubscriptionStatus';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { user, updateProfile, logout, isAuthenticated } = useAuthStore();

  const handleLanguageChange = async (language: Language) => {
    if (user) {
      await updateProfile({ language });
      i18n.changeLanguage(language);
    }
  };

  const handleThemeChange = async (theme: Theme) => {
    if (user) {
      await updateProfile({ theme });
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t('settings.logout'),
      t('settings.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('settings.logout'), style: 'destructive', onPress: logout },
      ]
    );
  };

  const languages = [
    { value: Language.ARABIC, label: 'العربية', flag: '🇸🇦' },
    { value: Language.ENGLISH, label: 'English', flag: '🇬🇧' },
  ];

  const themes = [
    { value: Theme.LIGHT, label: 'Light' },
    { value: Theme.DARK, label: 'Dark' },
    { value: Theme.SYSTEM, label: 'System' },
  ];

  const madhabs = [
    { value: Madhab.HANAFI, label: t('fiqh.hanafi') },
    { value: Madhab.MALIKI, label: t('fiqh.maliki') },
    { value: Madhab.SHAFI_I, label: t('fiqh.shafi_i') },
    { value: Madhab.HANBALI, label: t('fiqh.hanbali') },
  ];

  const dialects = [
    { value: Dialect.TUNISIAN, label: t('fiqh.tunisian') },
    { value: Dialect.EGYPTIAN, label: t('fiqh.egyptian') },
    { value: Dialect.GULF, label: t('fiqh.gulf') },
    { value: Dialect.MOROCCAN, label: t('fiqh.moroccan') },
  ];

  const genders = [
    { value: Gender.MALE, label: t('settings.male') },
    { value: Gender.FEMALE, label: t('settings.female') },
    { value: Gender.UNSPECIFIED, label: t('settings.unspecified') },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('settings.account')}</Text>
        
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email || 'Not signed in'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{user?.name || '-'}</Text>
          </View>
        </View>

        <SubscriptionStatus />

        <Text style={styles.sectionTitle}>{t('settings.preferences')}</Text>

        <View style={styles.section}>
          <Text style={styles.label}>{t('settings.language')}</Text>
          <View style={styles.optionsRow}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                style={[
                  styles.optionButton,
                  user?.language === lang.value && styles.optionButtonActive,
                ]}
                onPress={() => handleLanguageChange(lang.value as Language)}
              >
                <Text style={styles.optionFlag}>{lang.flag}</Text>
                <Text
                  style={[
                    styles.optionLabel,
                    user?.language === lang.value && styles.optionLabelActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('settings.theme')}</Text>
          <View style={styles.optionsRow}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.value}
                style={[
                  styles.optionButton,
                  user?.theme === theme.value && styles.optionButtonActive,
                ]}
                onPress={() => handleThemeChange(theme.value as Theme)}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    user?.theme === theme.value && styles.optionLabelActive,
                  ]}
                >
                  {theme.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('fiqh.madhab')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {madhabs.map((m) => (
                <TouchableOpacity
                  key={m.value}
                  style={[
                    styles.optionButton,
                    user?.madhab === m.value && styles.optionButtonActive,
                    { minWidth: 100 }
                  ]}
                  onPress={() => updateProfile({ madhab: m.value })}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      user?.madhab === m.value && styles.optionLabelActive,
                    ]}
                  >
                    {m.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('fiqh.dialect')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.optionsRow}>
              {dialects.map((d) => (
                <TouchableOpacity
                  key={d.value}
                  style={[
                    styles.optionButton,
                    user?.dialect === d.value && styles.optionButtonActive,
                    { minWidth: 100 }
                  ]}
                  onPress={() => updateProfile({ dialect: d.value })}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      user?.dialect === d.value && styles.optionLabelActive,
                    ]}
                  >
                    {d.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>{t('settings.gender')}</Text>
          <View style={styles.optionsRow}>
            {genders.map((g) => (
              <TouchableOpacity
                key={g.value}
                style={[
                  styles.optionButton,
                  user?.gender === g.value && styles.optionButtonActive,
                ]}
                onPress={() => updateProfile({ gender: g.value })}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    user?.gender === g.value && styles.optionLabelActive,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>

        <View style={styles.section}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.notificationsEnabled')}</Text>
            <Switch
              value={user?.notificationsEnabled ?? true}
              onValueChange={(value) => updateProfile({ notificationsEnabled: value })}
              trackColor={{ false: '#3a3a4e', true: '#4CAF50' }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.prayerNotifications')}</Text>
            <Switch
              value={user?.prayerTimeNotifications ?? true}
              onValueChange={(value) => updateProfile({ prayerTimeNotifications: value })}
              trackColor={{ false: '#3a3a4e', true: '#4CAF50' }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.athkarReminders')}</Text>
            <Switch
              value={user?.athkarReminders ?? true}
              onValueChange={(value) => updateProfile({ athkarReminders: value })}
              trackColor={{ false: '#3a3a4e', true: '#4CAF50' }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('settings.islamicEventsNotifications')}</Text>
            <Switch
              value={user?.islamicEventsNotifications ?? true}
              onValueChange={(value) => updateProfile({ islamicEventsNotifications: value })}
              trackColor={{ false: '#3a3a4e', true: '#4CAF50' }}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>{t('settings.location')}</Text>

        <View style={styles.section}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Latitude</Text>
            <Text style={styles.infoValue}>
              {user?.latitude?.toFixed(6) || 'Not set'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Longitude</Text>
            <Text style={styles.infoValue}>
              {user?.longitude?.toFixed(6) || 'Not set'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => router.push('/settings/location')}
          >
            <Text style={styles.locationButtonText}>{t('settings.updateLocation')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>{t('settings.logout')}</Text>
        </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 16,
    marginBottom: 12,
  },
  section: {
    backgroundColor: '#2a2a3e',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  infoLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  infoValue: {
    fontSize: 14,
    color: '#fff',
  },
  label: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3a3a4e',
  },
  optionButtonActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#1e4d2b',
  },
  optionFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  optionLabel: {
    fontSize: 14,
    color: '#aaa',
  },
  optionLabelActive: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  switchLabel: {
    fontSize: 14,
    color: '#fff',
  },
  locationButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#3a2a2a',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  logoutText: {
    color: '#ff5252',
    fontSize: 16,
    fontWeight: '600',
  },
});

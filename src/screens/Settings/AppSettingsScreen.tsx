import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigations/SettingsStack';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AppSettings'>;

const AppSettingsScreen = ({ navigation }: Props) => {
  const { theme, language, setTheme, setLanguage } = useSettingsStore();
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() =>
            navigation
              .getParent()
              ?.navigate('SettingsStack', { screen: 'Settings' })
          }
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('app_settings')}</Text>
      </View>

      <View style={styles.settingContainer}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>{t('dark_mode')}</Text>
          <Switch
            value={theme === 'dark'}
            onValueChange={value => setTheme(value ? 'dark' : 'light')}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>
            {t('language')}:{' '}
            {language === 'en' ? t('english') : t('vietnamese')}
          </Text>
          <TouchableOpacity
            onPress={() => setLanguage(language === 'en' ? 'vi' : 'en')}
          >
            <Ionicons name="globe-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 0, height: 50 },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: 10,
    position: 'relative',
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  backIcon: { position: 'absolute', left: 20 },
  settingContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#f2f2f2',
    elevation: 10,
    gap: 20,
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  settingText: { fontSize: 16, fontWeight: '500' },
});

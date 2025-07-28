import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Switch } from 'react-native';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigations/SettingStack';
import { useSettingsStore } from '../../stores/useSettingsStore';
import { useTheme } from '@react-navigation/native';

type Props = NativeStackScreenProps<SettingsStackParamList, 'AppSettings'>;

const AppSettingsScreen = ({ navigation }: Props) => {
  const { theme, language, setTheme, setLanguage } = useSettingsStore();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>
      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>App Settings</Text>
      </View>

      {/* Theme Switch */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>Dark Mode</Text>
        <Switch
          value={theme === 'dark'}
          onValueChange={value => setTheme(value ? 'dark' : 'light')}
        />
      </View>

      {/* Language Switch */}
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>
          Language: {language === 'en' ? 'English' : 'Tiếng Việt'}
        </Text>
        <TouchableOpacity
          onPress={() => setLanguage(language === 'en' ? 'vi' : 'en')}
        >
          <Ionicons name="globe-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AppSettingsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7F7' },
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  settingText: { fontSize: 16, fontWeight: '500' },
});

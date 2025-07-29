import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../../navigations/HomeStack';
import ButtonCustom from '../../components/ButtonCustom';
import SettingItem from '../../components/SettingItem';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SettingsStackParamList } from '../../navigations/SettingsStack';
import { useTranslation } from 'react-i18next';

type SettingsScreenProp = NativeStackScreenProps<
  SettingsStackParamList,
  'Settings'
>;

const SettingsScreen = ({ navigation }: SettingsScreenProp) => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() =>
            navigation.getParent()?.navigate('HomeStack', { screen: 'Home' })
          }
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('settings')}</Text>
      </View>

      <View style={styles.settingContainer}>
        <SettingItem
          title={t('profile')}
          onPress={() => navigation.navigate('Profile')}
        />
        <SettingItem
          title={t('app-settings')}
          onPress={() => navigation.navigate('AppSettings')}
        />
        <SettingItem
          title={t('data-management')}
          onPress={() => navigation.navigate('DataManagementStack')}
        />
        <SettingItem
          title={t('about')}
          onPress={() => navigation.navigate('About')}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 0,
    height: 50,
  },
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
  backIcon: {
    position: 'absolute',
    left: 20,
  },
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
});

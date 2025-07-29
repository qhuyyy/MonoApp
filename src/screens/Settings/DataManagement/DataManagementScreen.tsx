import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Rectangle from '../../../assets/svg/Rectangle';
import SettingItem from '../../../components/SettingItem';
import { DataManagementStackParamList } from '../../../navigations/DataManagementStack';
import { useTransactionStore } from '../../../stores/useTransactionStore';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<
  DataManagementStackParamList,
  'DataManagement'
>;

const DataManagementScreen = ({ navigation }: Props) => {
  const { clearAll } = useTransactionStore();
  const { t } = useTranslation();

  const handleClear = () => {
    Alert.alert(
      t('confirm'),
      t('are-you-sure-you-want-to-delete-all-data?'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await clearAll();
            Alert.alert(t('success'), t('all-data-has-been-deleted!'));
          },
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.title}>{t('data-management')}</Text>
      </View>

      <View style={styles.settingContainer}>
        <SettingItem
          title={t('export-data-json')}
          onPress={() => navigation.navigate('Export')}
        />
        <SettingItem
          title={t('import-data-json')}
          onPress={() => navigation.navigate('Import')}
        />
        <SettingItem title={t('delete-all-data')} onPress={handleClear} />
      </View>
    </View>
  );
};

export default DataManagementScreen;

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
  body: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#2A7C76',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
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

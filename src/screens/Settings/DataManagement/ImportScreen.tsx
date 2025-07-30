import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { pick } from '@react-native-documents/picker'; // ✅ dùng đúng API
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DataManagementStackParamList } from '../../../navigations/DataManagementStack';
import Rectangle from '../../../assets/svg/Rectangle';
import { useTransactionStore } from '../../../stores/useTransactionStore';
import TransactionItem from '../../../components/TransactionItem';
import { useTranslation } from 'react-i18next';
import ButtonCustom from '../../../components/ButtonCustom';
import { useDataManagementStore } from '../../../stores/useDataManagementStore';

type Props = NativeStackScreenProps<DataManagementStackParamList, 'Import'>;

const ImportScreen = ({ navigation }: Props) => {
  const { previewData, setPreviewData, replace, setReplace } =
    useDataManagementStore();
  const { t } = useTranslation();
  const previewImportJson = useTransactionStore(
    state => state.previewImportJson,
  );
  const confirmImportJson = useTransactionStore(
    state => state.confirmImportJson,
  );

  const handlePickFile = async () => {
    try {
      const files = await pick({ type: ['application/json'] });
      if (!files || files.length === 0) return;

      const file = files[0];
      const preview = await previewImportJson(file.uri);
      setPreviewData(preview);

      Alert.alert(
        t('preview-loaded'),
        t('transaction-count', { count: preview.length }),
      );
    } catch (error: any) {
      Alert.alert(t('error'), error?.message || t('error-pick-file'));
      setPreviewData([]);
    }
  };

  const handleConfirm = async () => {
    if (previewData.length === 0) {
      Alert.alert(t('there-is-no-data-to-import!'));
      return;
    }
    await confirmImportJson(previewData, replace);
    setPreviewData([]);
    Alert.alert(t('success'), t('import-data-successfully!'));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.navigate('DataManagement')}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('import-data')}</Text>
      </View>

      <View style={styles.settingContainer}>
        <ButtonCustom text={t('choose-json-file')} onPress={handlePickFile} />

        {previewData.length > 0 && (
          <>
            <ButtonCustom
              text={replace ? t('replace-data') : t('merge-data')}
              onPress={() => setReplace(!replace)}
              active={replace}
            />

            <FlatList
              data={previewData.slice(0, 10)}
              keyExtractor={(item, index) => `${item.id || index}`}
              renderItem={({ item }) => <TransactionItem transaction={item} />}
            />
            {previewData.length > 10 && (
              <Text>
                {t('and-more-transactions', { count: previewData.length - 10 })}
              </Text>
            )}

            <ButtonCustom text={t('import-json')} onPress={handleConfirm} />
          </>
        )}
      </View>
    </View>
  );
};

export default ImportScreen;

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
  btn: {
    backgroundColor: '#2A7C76',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
  },
  btnActive: { backgroundColor: '#175E57' },
  btnText: { color: '#fff', textAlign: 'center', fontSize: 16 },
  btnConfirm: {
    backgroundColor: '#1A7C2A',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
});

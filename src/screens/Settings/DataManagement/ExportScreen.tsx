import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Switch,
  Pressable,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import Rectangle from '../../../assets/svg/Rectangle';
import { useTransactionStore } from '../../../stores/useTransactionStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DataManagementStackParamList } from '../../../navigations/DataManagementStack';
import ButtonCustom from '../../../components/ButtonCustom';
import { useTranslation } from 'react-i18next';
import { useDataManagementStore } from '../../../stores/useDataManagementStore';

type Props = NativeStackScreenProps<DataManagementStackParamList, 'Export'>;

const ExportScreen = ({ navigation }: Props) => {
  const { exportData, transactions } = useTransactionStore();
  const { t } = useTranslation();
  const {
    includeTransactions,
    includeCategories,
    minDate,
    maxDate,
    defaultMinDate,
    defaultMaxDate,
    openMin,
    openMax,
    setIncludeTransactions,
    setIncludeCategories,
    setMinDate,
    setMaxDate,
    setDefaultMinDate,
    setDefaultMaxDate,
    setOpenMin,
    setOpenMax,
  } = useDataManagementStore();

  useEffect(() => {
    if (transactions.length > 0) {
      const dates = transactions.map(t => new Date(t.date));
      const min = new Date(Math.min(...dates.map(d => d.getTime())));
      const max = new Date(Math.max(...dates.map(d => d.getTime())));
      setDefaultMinDate(min);
      setDefaultMaxDate(max);

      // chỉ set giá trị mặc định nếu chưa chọn trước đó
      if (!minDate) setMinDate(min);
      if (!maxDate) setMaxDate(max);
    }
  }, [transactions]);

  const handleExport = async () => {
    try {
      await exportData({
        includeTransactions,
        includeCategories,
        minDate,
        maxDate,
      });

      Alert.alert(t('success'), t('data-has-been-exported-successfully!'));
      navigation.navigate('DataManagement');
    } catch (error) {
      Alert.alert(t('error'), t('data-has-been-exported-unsuccessfully!'));
    }
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
        <Text style={styles.title}>{t('export-data')}</Text>
      </View>

      <View style={styles.settingContainer}>
        <View style={styles.row}>
          <Text style={styles.inputLabel}>{t('include-transactions')}</Text>
          <Switch
            value={includeTransactions}
            onValueChange={setIncludeTransactions}
          />
        </View>

        <View style={styles.row}>
          <Text style={styles.inputLabel}>{t('include-categories')}</Text>
          <Switch
            value={includeCategories}
            onValueChange={setIncludeCategories}
          />
        </View>

        <Text style={[styles.inputLabel, { marginTop: 20 }]}>
          {t('from-date')}
        </Text>
        <Pressable onPress={() => setOpenMin(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>
            {minDate ? format(minDate, 'dd-MM-yyyy') : ''}
          </Text>
        </Pressable>
        <DatePicker
          modal
          open={openMin}
          date={minDate || new Date()}
          mode="date"
          minimumDate={defaultMinDate || undefined}
          maximumDate={defaultMaxDate || new Date()}
          onConfirm={d => {
            setOpenMin(false);
            setMinDate(d);
          }}
          onCancel={() => setOpenMin(false)}
        />

        <Text style={[styles.inputLabel, { marginTop: 20 }]}>
          {t('to-date')}
        </Text>
        <Pressable onPress={() => setOpenMax(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>
            {maxDate ? format(maxDate, 'dd-MM-yyyy') : ''}
          </Text>
        </Pressable>
        <DatePicker
          modal
          open={openMax}
          date={maxDate || new Date()}
          mode="date"
          minimumDate={defaultMinDate || undefined}
          maximumDate={defaultMaxDate || new Date()}
          onConfirm={d => {
            setOpenMax(false);
            setMaxDate(d);
          }}
          onCancel={() => setOpenMax(false)}
        />

        <View style={{ marginTop: 20 }}>
          <ButtonCustom text={t('export-json')} onPress={handleExport} />
        </View>
      </View>
    </View>
  );
};

export default ExportScreen;

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
  content: { padding: 20 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: { fontSize: 16, fontWeight: '500' },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#429690',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    height: 50,
  },
  dateText: { fontSize: 16 },
  exportBtn: {
    backgroundColor: '#2A7C76',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  exportBtnText: { color: '#fff', fontSize: 18, textAlign: 'center' },
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

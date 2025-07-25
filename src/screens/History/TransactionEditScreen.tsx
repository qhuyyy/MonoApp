import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { Controller } from 'react-hook-form';

import Rectangle from '../../assets/svg/Rectangle';
import ButtonCustom from '../../components/ButtonCustom';
import OutlineButtonCustom from '../../components/OutlineButtonCustom';
import FormInput from '../../components/FormInput';
import { Category } from '../../types/types';
import { useUserStore } from '../../stores/useUserStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../../navigations/HistoryStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { useEditTransactionForm } from '../../hooks/useEditTransForm';

type Props = NativeStackScreenProps<HistoryStackParamList, 'TransactionEdit'>;

const TransactionEditScreen = ({ navigation, route }: Props) => {
  const { transaction } = route.params;
  const [openPicker, setOpenPicker] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const currency = useUserStore(state => state.currency);

  const {
    watch,
    setValue,
    handleSubmit,
    handleUpdate,
    handleDelete,
    formState,
  } = useEditTransactionForm(transaction);

  const selectedDate = watch('date');

  const fetchIncomeCategories = async () => {
    const storedData = await AsyncStorage.getItem('category-storage');
    if (storedData) {
      const parsed = JSON.parse(storedData);
      const allCategories: Category[] = parsed.state?.categories || [];
      const filtered = allCategories.filter(
        cat => cat.status === transaction.category?.status,
      );
      setIncomeCategories(filtered);
    }
  };

  const onSubmit = async (data: any) => {
    await handleUpdate(data);
    Alert.alert('Success', 'Transaction updated successfully', [
      { text: 'OK', onPress: () => navigation.navigate('TransactionsHistory') },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert('Delete Transaction', 'Are you sure you want to delete?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await handleDelete();
          navigation.navigate('TransactionsHistory');
        },
      },
    ]);
  };

  useEffect(() => {
    fetchIncomeCategories();
  }, [transaction.category?.status]);

  return (
    <View style={styles.container}>
      <Rectangle style={StyleSheet.absoluteFillObject} />
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('TransactionsHistory')}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Transaction</Text>
      </View>
      <View style={styles.form}>
        {/* Status */}
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          <Text style={styles.inputLabel}>Status:</Text>
          <Text
            style={[
              styles.statusText,
              transaction.category?.status === 'income'
                ? styles.income
                : styles.expense,
            ]}
          >
            {transaction.category?.status?.toUpperCase()}
          </Text>
        </View>

        {/* Amount */}
        <FormInput
          value={String(watch('amount') || '')}
          placeholder={`Enter amount (${currency})`}
          title="Amount"
          keyboardType="numeric"
          onChangeText={text => setValue('amount', Number(text))}
          error={formState.errors.amount?.message}
        />

        {/* Description */}
        <FormInput
          value={watch('description') || ''}
          placeholder="Enter a description"
          title="Description"
          onChangeText={text => setValue('description', text)}
          error={formState.errors.description?.message}
        />

        {/* Category */}
        <View>
          <Text style={styles.inputLabel}>Category</Text>
          <Dropdown
            style={styles.dropdown}
            data={incomeCategories.map(cat => ({
              label: cat.name,
              value: cat.id,
              icon: cat.icon,
            }))}
            labelField="label"
            valueField="value"
            value={watch('category')?.id}
            renderItem={item => {
              const category = incomeCategories.find(
                cat => cat.id === item.value,
              );
              return (
                <View style={styles.dropdownItem}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={category?.color || '#429690'}
                    style={{ marginRight: 10 }}
                  />
                  <Text>{item.label}</Text>
                </View>
              );
            }}
            renderLeftIcon={() => (
              <Ionicons
                name={watch('category')?.icon || 'folder-outline'}
                size={20}
                color={watch('category')?.color || '#429690'}
                style={{ marginRight: 10 }}
              />
            )}
            onChange={item => {
              const selected = incomeCategories.find(
                cat => cat.id === item.value,
              );
              if (selected) setValue('category', selected);
            }}
          />
          {formState.errors.category?.message && (
            <Text style={styles.errorText}>
              {formState.errors.category.message}
            </Text>
          )}
        </View>

        {/* Date */}
        <Text style={styles.inputLabel}>Date</Text>
        <Pressable onPress={() => setOpenPicker(true)} style={styles.dateInput}>
          <Text style={styles.dateText}>
            {format(selectedDate ?? new Date(), 'yyyy-MM-dd')}
          </Text>
        </Pressable>
        <DatePicker
          modal
          open={openPicker}
          date={selectedDate ?? new Date()}
          mode="date"
          maximumDate={new Date()}
          onConfirm={date => {
            setOpenPicker(false);
            setValue('date', date);
          }}
          onCancel={() => setOpenPicker(false)}
        />

        <View style={{ marginTop: 10 }}>
          <ButtonCustom text="Update" onPress={handleSubmit(onSubmit)} />
        </View>
        <View style={{ marginTop: 10 }}>
          <OutlineButtonCustom text="Delete" onPress={confirmDelete} />
        </View>
      </View>
    </View>
  );
};

export default TransactionEditScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E9F3F2' },
  form: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    marginTop: 90,
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    top: 50,
  },
  backButton: { position: 'absolute', left: 0, padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  inputLabel: {
    fontSize: 14,
    color: '#429690',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    marginBottom: 12,
    height: 50,
  },
  dateText: { color: '#333', fontSize: 16 },
  errorText: { fontSize: 12, color: 'red', marginTop: 5 },
  statusText: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  income: { color: '#2E7D32' },
  expense: { color: '#C62828' },
  dropdown: {
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: 'center',
    height: 50,
    marginBottom: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
});

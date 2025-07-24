import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import uuid from 'react-native-uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';

import Rectangle from '../../assets/svg/Rectangle';
import ButtonCustom from '../../components/ButtonCustom';
import FormInput from '../../components/FormInput';
import { Category, Transaction } from '../../types/types';
import { useUserStore } from '../../stores/useUserStore';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../../navigations/HistoryStack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import { transactionSchema } from '../../validation/TransactionSchema';
import OutlineButtonCustom from '../../components/OutlineButtonCustom';

type EditTransactionScreenProps = NativeStackScreenProps<
  HistoryStackParamList,
  'EditTransaction'
>;

const EditTransactionScreen = ({
  navigation,
  route,
}: EditTransactionScreenProps) => {
  const { transaction } = route.params;

  const currency = useUserStore(state => state.currency);

  const updateTransaction = useTransactionStore(
    state => state.updateTransaction,
  );
  const deleteTransaction = useTransactionStore(
    state => state.deleteTransaction,
  );
  const [openPicker, setOpenPicker] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id],
    );
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      'Are you sure you want to delete this transaction?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transaction.id);
            navigation.navigate('History');
          },
        },
      ],
    );
  };

  useEffect(() => {
    const fetchIncomeCategories = async () => {
      const storedData = await AsyncStorage.getItem('category-storage');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const allCategories: Category[] = parsed.state?.categories || [];
        const incomeOnly = allCategories.filter(
          cat => cat.status === transaction.category?.status,
        );
        setIncomeCategories(incomeOnly);
      }
    };
    fetchIncomeCategories();
    console.log(transaction);
  }, [transaction.category?.status]);

  return (
    <Formik
      enableReinitialize
      initialValues={{
        amount: String(transaction.amount),
        description: transaction.description || '',
        category: transaction.category,
        date: new Date(transaction.date),
        type: transaction.category?.status || 'income',
        image: transaction.image || '',
      }}
      validationSchema={transactionSchema}
      onSubmit={async values => {
        await updateTransaction({
          ...transaction,
          amount: parseFloat(values.amount),
          description: values.description,
          category: values.category,
          date: new Date().toISOString(),
          image: values.image,
        });
        Alert.alert('Success', 'Transaction updated successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('History'),
          },
        ]);
      }}
    >
      {({
        handleChange,
        handleSubmit,
        setFieldValue,
        values,
        errors,
        touched,
      }) => (
        <View style={styles.container}>
          <View>
            <Rectangle style={StyleSheet.absoluteFillObject} />
            <View style={styles.headerContent}>
              <TouchableOpacity
                onPress={() => navigation.navigate('History')}
                style={styles.backButton}
              >
                <Ionicons name="chevron-back-outline" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Edit Transaction</Text>
            </View>
          </View>

          <View style={styles.form}>
            <View
              style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
            >
              <Text style={styles.inputLabel}>Status:</Text>
              <Text
                style={[
                  styles.statusText,
                  values.category?.status === 'income'
                    ? styles.income
                    : styles.expense,
                ]}
              >
                {values.category?.status?.toUpperCase()}
              </Text>
            </View>

            <FormInput
              value={values.amount}
              placeholder={`Enter amount (${currency})`}
              title="Amount"
              keyboardType="numeric"
              onChangeText={handleChange('amount')}
              error={touched.amount && errors.amount}
            />

            <FormInput
              value={values.description}
              placeholder="Enter a description"
              title="Description"
              onChangeText={handleChange('description')}
              error={touched.description && errors.description}
            />
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
                value={values.category?.id}
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
                    name={values.category?.icon || 'folder-outline'}
                    size={20}
                    color={values.category?.color || '#429690'}
                    style={{ marginRight: 10 }}
                  />
                )}
                onChange={item => {
                  const selected = incomeCategories.find(
                    cat => cat.id === item.value,
                  );
                  if (selected) setFieldValue('category', selected);
                }}
              />

              {touched.category && typeof errors.category === 'string' && (
                <Text style={styles.errorText}>{errors.category}</Text>
              )}
            </View>

            <View style={{ marginTop: 8 }}>
              <Text style={styles.inputLabel}>Date</Text>
              <Pressable
                onPress={() => setOpenPicker(true)}
                style={styles.dateInput}
              >
                <Text style={styles.dateText}>
                  {format(values.date, 'yyyy-MM-dd')}
                </Text>
              </Pressable>
              <DatePicker
                modal
                open={openPicker}
                date={values.date}
                mode="date"
                maximumDate={new Date()}
                onConfirm={selectedDate => {
                  setOpenPicker(false);
                  setFieldValue('date', selectedDate);
                }}
                onCancel={() => setOpenPicker(false)}
              />
              {touched.date && typeof errors.date === 'string' && (
                <Text style={styles.errorText}>{errors.date}</Text>
              )}
            </View>

            <View style={{ marginTop: 10 }}>
              <ButtonCustom text="Update" onPress={handleSubmit} />
            </View>

            <View style={{ marginTop: 10 }}>
              <OutlineButtonCustom text="Delete" onPress={handleDelete} />
            </View>
          </View>
        </View>
      )}
    </Formik>
  );
};

export default EditTransactionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F3F2',
  },
  header: {
    padding: 20,
    paddingTop: 0,
    height: 100,
  },
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
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  title: {
    color: 'green',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#429690',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
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
  dateText: {
    color: '#333',
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 5,
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  income: {
    color: '#2E7D32',
  },
  expense: {
    color: '#C62828',
  },
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

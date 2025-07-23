import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Rectangle from '../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormInput from '../components/FormInput';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { Formik } from 'formik';
import { transactionSchema } from '../validation/TransactionSchema';

import { Category, Transaction } from '../types/types';
import { useUserStore } from '../stores/useUserStore';
import ButtonCustom from '../components/ButtonCustom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTransactionStore } from '../stores/useTransactionStore';
import uuid from 'react-native-uuid';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainBottomTabsParamList } from './MainBottomTabs';
import { useNavigation } from '@react-navigation/native';

import { windowWidth } from '../utils/Dimensions';

type AddNewTransNavigationProp = NativeStackNavigationProp<
  MainBottomTabsParamList,
  'AddNewTrans'
>;

export default function TransactionTabs() {
  const [activeTab, setActiveTab] = useState<'Income' | 'Expense'>('Income');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />

        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => {}} style={styles.backButton}>
            <Ionicons name="chevron-back-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add a new Transaction</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => setActiveTab('Income')}
            style={[styles.tabItem, activeTab === 'Income' && styles.activeTab]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Income' && styles.activeText,
              ]}
            >
              Income
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('Expense')}
            style={[
              styles.tabItem,
              activeTab === 'Expense' && styles.activeTab,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Expense' && styles.activeText,
              ]}
            >
              Expense
            </Text>
          </Pressable>
        </View>

        {/* Content */}
        {activeTab === 'Income' ? <IncomeTab /> : <ExpenseTab />}
      </View>
    </View>
  );
}

function IncomeTab() {
  const [openPicker, setOpenPicker] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [initialCategory, setInitialCategory] = useState<Category | null>(null);

  const navigation = useNavigation<AddNewTransNavigationProp>();

  const currency = useUserStore(state => state.currency);
  const addTransaction = useTransactionStore(state => state.addTransaction);

  const handlePickImage = (setFieldValue: any) => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.5 }, response => {
      if (
        !response.didCancel &&
        response.assets &&
        response.assets.length > 0
      ) {
        setFieldValue('image', response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    const fetchIncomeCategories = async () => {
      try {
        const storedData = await AsyncStorage.getItem('category-storage');
        if (storedData) {
          const parsed = JSON.parse(storedData);
          const allCategories: Category[] = parsed.state?.categories || [];

          const incomeOnly = allCategories.filter(
            cat => cat.status === 'income',
          );

          setIncomeCategories(incomeOnly);
          if (incomeOnly.length > 0) {
            setInitialCategory(incomeOnly[0]);
          }
        }
      } catch (error) {
        console.error('Failed to load income categories:', error);
      }
    };

    fetchIncomeCategories();
  }, []);

  if (!initialCategory) {
    return <Text style={{ padding: 20 }}>Loading categories...</Text>;
  }

  return (
    <Formik
      enableReinitialize
      initialValues={{
        amount: '',
        description: '',
        category: initialCategory,
        date: new Date(),
        type: 'income',
        image: '',
      }}
      validationSchema={transactionSchema}
      onSubmit={async (values, { resetForm }) => {
        const newTransaction: Transaction = {
          id: uuid.v4().toString(),
          amount: parseFloat(values.amount),
          description: values.description,
          image: values.image,
          category: values.category,
          date: values.date.toISOString(),
        };

        await addTransaction(newTransaction);
        navigation.navigate('Home');
        resetForm({
          values: {
            ...values,
            amount: '',
            description: '',
            image: '',
          },
        });
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
        <View style={styles.formContainer}>
          <Text style={styles.inputLabel}>Select image (optional)</Text>
          <TouchableOpacity
            onPress={() => handlePickImage(setFieldValue)}
            style={styles.imageContainer}
          >
            {values.image ? (
              <Image source={{ uri: values.image }} style={styles.image} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imageText}>Pick Image</Text>
              </View>
            )}
          </TouchableOpacity>

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
            title="Description (optional)"
            onChangeText={handleChange('description')}
            error={touched.description && errors.description}
          />

          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={values.category?.id}
              onValueChange={value => {
                const selected = incomeCategories.find(cat => cat.id === value);
                if (selected) setFieldValue('category', selected);
              }}
            >
              {incomeCategories.map(cat => (
                <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
              ))}
            </Picker>
          </View>

          {touched.category && typeof errors.category === 'string' && (
            <Text style={styles.errorText}>{errors.category}</Text>
          )}

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

          <View style={{ marginTop: 10 }}>
            <ButtonCustom text="Save Transaction" onPress={handleSubmit} />
          </View>
        </View>
      )}
    </Formik>
  );
}

function ExpenseTab() {
  return <View></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F9FA',
  },
  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#00856F',
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
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
  mainContent: {
    flex: 1,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    gap: 20,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F0F3F4',
    borderRadius: 24,
    padding: 4,
    alignSelf: 'center',
    width: windowWidth * 0.6,
    marginBottom: 24,
    marginTop: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#5B5B5B',
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: '#00856F',
    fontWeight: '700',
  },
  formContainer: {
    flex: 1,
    padding: 16,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -24,
    borderWidth: 1,
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 14,
    color: '#429690',
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
  imagePicker: {
    marginTop: 4,
    padding: 10,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  imageContainer: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  imagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageText: {
    color: '#fff',
    fontSize: 12,
  },
  submitButton: {
    marginTop: 10,
    backgroundColor: '#2A7C76',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
  },
});

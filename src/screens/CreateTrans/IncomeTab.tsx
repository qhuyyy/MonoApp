import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FormInput from '../../components/FormInput';
import { Picker } from '@react-native-picker/picker';
import { format } from 'date-fns';
import DatePicker from 'react-native-date-picker';

import { Category } from '../../types/types';
import { useUserStore } from '../../stores/useUserStore';
import ButtonCustom from '../../components/ButtonCustom';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTransactionStore } from '../../stores/useTransactionStore';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { windowWidth } from '../../utils/Dimensions';
import { useCreateTransForm } from '../../hooks/useCreateTransForm';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainBottomTabsParamList } from '../../navigations/MainBottomTabs';

type CreateTransNavigationProp = NativeStackNavigationProp<
  MainBottomTabsParamList,
  'CreateTransactionScreen'
>;

function IncomeTab() {
  const [openPicker, setOpenPicker] = useState(false);
  const [incomeCategories, setIncomeCategories] = useState<Category[]>([]);
  const [initialCategory, setInitialCategory] = useState<Category | null>(null);

  const navigation = useNavigation<CreateTransNavigationProp>();
  const currency = useUserStore(state => state.currency);
  const addTransaction = useTransactionStore(state => state.addTransaction);

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
            const defaultCat = incomeOnly[0];
            setInitialCategory(defaultCat);

            form.reset({
              amount: '',
              description: '',
              category: defaultCat,
              date: new Date(),
              type: 'income',
              image: '',
            });
          }
        }
      } catch (error) {
        console.error('Failed to load income categories:', error);
      }
    };

    fetchIncomeCategories();
  }, []);

  const form = useCreateTransForm(
    {
      amount: '',
      description: '',
      category: initialCategory,
      date: new Date(),
      type: 'income',
      image: '',
    },
    async values => {
      await addTransaction({
        id: uuid.v4().toString(),
        amount: parseFloat(values.amount),
        description: values.description,
        image: values.image,
        category: values.category,
        date: values.date.toISOString(),
      });
      Alert.alert('Success', 'Transaction created successfully', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('HistoryStack', { screen: 'History' }),
        },
      ]);
      form.reset();
    },
  );

  if (!initialCategory)
    return <Text style={{ padding: 20 }}>Loading categories...</Text>;

  return (
    <View style={[styles.formContainer, { borderColor: 'green' }]}>
      <Text
        style={{
          color: 'green',
          alignSelf: 'center',
          fontWeight: 'bold',
          fontSize: 20,
          marginBottom: 10,
        }}
      >
        Add Income
      </Text>

      <FormInput
        value={form.watch('amount')}
        placeholder={`Enter amount (${currency})`}
        title="Amount"
        keyboardType="numeric"
        onChangeText={text => form.setValue('amount', text)}
        error={form.formState.errors.amount?.message as string | undefined}
      />

      <FormInput
        value={form.watch('description')}
        placeholder="Enter a description"
        title="Description (optional)"
        onChangeText={text => form.setValue('description', text)}
        error={form.formState.errors.description?.message as string | undefined}
      />

      <Text style={styles.inputLabel}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={form.watch('category')?.id}
          onValueChange={value => {
            const selected = incomeCategories.find(cat => cat.id === value);
            if (selected) form.setValue('category', selected);
          }}
        >
          {incomeCategories.map(cat => (
            <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
          ))}
        </Picker>
      </View>
      {form.formState.errors.category?.message && (
        <Text style={styles.errorText}>
          {form.formState.errors.category?.message as string}
        </Text>
      )}

      <Text style={styles.inputLabel}>Date</Text>
      <Pressable onPress={() => setOpenPicker(true)} style={styles.dateInput}>
        <Text style={styles.dateText}>
          {format(form.watch('date'), 'yyyy-MM-dd')}
        </Text>
      </Pressable>
      <DatePicker
        modal
        open={openPicker}
        date={form.watch('date')}
        mode="date"
        maximumDate={new Date()}
        onConfirm={selectedDate => {
          setOpenPicker(false);
          form.setValue('date', selectedDate);
        }}
        onCancel={() => setOpenPicker(false)}
      />
      {form.formState.errors.date?.message && (
        <Text style={styles.errorText}>
          {form.formState.errors.date.message as string}
        </Text>
      )}

      <View style={{ marginTop: 10 }}>
        <ButtonCustom text="Save Transaction" onPress={form.onSubmit} />
      </View>
    </View>
  );
}

export default IncomeTab;

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    padding: 16,
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -24,
    borderWidth: 3,
    elevation: 10,
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

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../../components/ButtonCustom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import Rectangle from '../../assets/svg/Rectangle';
import { Picker } from '@react-native-picker/picker';
import { Form, useFormik } from 'formik';
import FormInput from '../../components/FormInput';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { categorySchema } from '../../validation/CategorySchema';
import uuid from 'react-native-uuid';

type CreateCategoryScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'CreateCategory'
>;

const COLORS = [
  '#FF6B6B', // Đỏ
  '#FF8C42', // Cam
  '#F4C430', // Vàng
  '#F39C12', // Vàng cam
  '#D35400', // Cam đậm
  '#E91E63', // Hồng
  '#9B59B6', // Tím
  '#2ECC71', // Xanh lá cây
  '#5DB075', // Xanh lá nhạt
  '#1ABC9C', // Xanh ngọc
  '#4D96FF', // Xanh dương
  '#34495E', // Xanh đen
  '#2C3E50', // Xanh đậm (mới thêm)
  '#1E272E', // Xanh xám tối (mới thêm)
];

const CreateCategoryScreen = ({ navigation }: CreateCategoryScreenProps) => {
  const [color, setColor] = useState(COLORS[0]);
  const addCategory = useCategoryStore(state => state.addCategory);

  const formik = useFormik({
    initialValues: {
      name: '',
      status: 'income',
    },
    validationSchema: categorySchema, // không có dấu {} ở đây
    onSubmit: (values, { resetForm }) => {
      addCategory({
        id: uuid.v4() as string,
        name: values.name,
        status: values.status as 'income' | 'expense',
        color,
      });
      resetForm();
      navigation.goBack();
    },
  });

  const { values, handleChange, handleSubmit, errors, touched } = formik;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />

        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add a new Category</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Category Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={values.status}
            onValueChange={handleChange('status')}
          >
            <Picker.Item label="Income" value="income" />
            <Picker.Item label="Expense" value="expense" />
          </Picker>
        </View>

        <Text style={styles.label}>Category Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter name..."
          value={formik.values.name}
          onChangeText={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
        />
        {formik.touched.name && formik.errors.name && (
          <Text style={{ color: 'red' }}>{formik.errors.name}</Text>
        )}

        <Text style={styles.label}>Choose Color</Text>
        <View style={styles.colorList}>
          {COLORS.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorItem,
                {
                  backgroundColor: c,
                  borderWidth: c === color ? 3 : 1,
                  borderColor: c === color ? '#333' : '#ccc',
                },
              ]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <ButtonCustom text="Save" onPress={formik.handleSubmit} />
      </View>
    </View>
  );
};

export default CreateCategoryScreen;

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
  },
  label: {
    fontWeight: 'bold',
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#429690',
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
    marginTop: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
  },
  colorList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 8,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
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
});

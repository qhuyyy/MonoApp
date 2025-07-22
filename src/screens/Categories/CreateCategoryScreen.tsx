import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../../components/ButtonCustom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import Rectangle from '../../assets/svg/Rectangle';
import { Picker } from '@react-native-picker/picker';
import { useFormik } from 'formik';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { categorySchema } from '../../validation/CategorySchema';
import uuid from 'react-native-uuid';
import { COLORS, ICONS } from '../../constants/Category';

type CreateCategoryScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'CreateCategory'
>;

const CreateCategoryScreen = ({ navigation }: CreateCategoryScreenProps) => {
  const [color, setColor] = useState(COLORS[0]);
  const [icon, setIcon] = useState(ICONS[0]);
  const addCategory = useCategoryStore(state => state.addCategory);

  const formik = useFormik({
    initialValues: {
      name: '',
      status: 'income',
    },
    validationSchema: categorySchema,
    onSubmit: (values, { resetForm }) => {
      addCategory({
        id: uuid.v4() as string,
        name: values.name,
        status: values.status as 'income' | 'expense',
        color,
        icon,
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
          value={values.name}
          onChangeText={handleChange('name')}
          onBlur={formik.handleBlur('name')}
        />
        {touched.name && errors.name && (
          <Text style={{ color: 'red' }}>{errors.name}</Text>
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

        <Text style={styles.label}>Choose Icon</Text>
        <View style={styles.iconList}>
          {ICONS.map(i => (
            <TouchableOpacity
              key={i}
              style={[
                styles.colorItem, 
                {
                  backgroundColor: icon === i ? color : '#ccc',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: icon === i ? 3 : 1,
                  borderColor: icon === i ? '#333' : '#ccc',
                },
              ]}
              onPress={() => setIcon(i)}
            >
              <Ionicons name={i} size={24} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>

        <ButtonCustom text="Save" onPress={handleSubmit} />
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
  iconList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 8,
  },
  iconItem: {
    padding: 10,
    borderRadius: 12,
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

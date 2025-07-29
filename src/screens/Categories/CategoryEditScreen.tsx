import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect } from 'react';
import ButtonCustom from '../../components/ButtonCustom';
import OutlineButtonCustom from '../../components/OutlineButtonCustom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import Rectangle from '../../assets/svg/Rectangle';
import { Picker } from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useEditCategoryForm } from '../../hooks/useEditCategoryForm';
import { COLORS, ICONS } from '../../constants/Category';
import { useTranslation } from 'react-i18next';

type EditCategoryScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'CategoryEdit'
>;

const CategoryEditScreen = ({ navigation, route }: EditCategoryScreenProps) => {
  const { category } = route.params;
  const { t } = useTranslation();

  const {
    watch,
    setValue,
    trigger,
    formState,
    handleSubmit,
    handleUpdate,
    handleDelete,
  } = useEditCategoryForm(category);

  const onSubmit = (values: {
    name: string;
    status: 'income' | 'expense';
    color: string;
    icon: string;
  }) => {
    handleUpdate(values);
    Alert.alert(t('success'), t('category-updated-successfully!'), [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  const confirmDelete = () => {
    Alert.alert(
      t('delete-category'),
      t('are-you-sure-you-want-to-delete-this-category?'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: async () => {
            await handleDelete();
            navigation.goBack();
          },
        },
      ],
    );
  };

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
          <Text style={styles.headerTitle}>{t('edit-category')}</Text>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{t('category-type')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={watch('status')}
            onValueChange={value => setValue('status', value)}
          >
            <Picker.Item label={t('income')} value="income" />
            <Picker.Item label={t('expense')} value="expense" />
          </Picker>
        </View>

        <Text style={styles.label}>{t('category-name')}</Text>
        <TextInput
          style={styles.input}
          placeholder={t('enter_name')}
          value={
            watch('name')
              ? t(watch('name')!.toLowerCase(), { defaultValue: watch('name') })
              : ''
          }
          onChangeText={text => setValue('name', text)}
          onBlur={() => trigger('name')}
        />
        {formState.errors.name && (
          <Text style={{ color: 'red' }}>{formState.errors.name.message}</Text>
        )}

        <Text style={styles.label}>{t('choose-color')}</Text>
        <View style={styles.colorList}>
          {COLORS.map(c => (
            <TouchableOpacity
              key={c}
              style={[
                styles.colorItem,
                {
                  backgroundColor: c,
                  borderWidth: watch('color') === c ? 3 : 1,
                  borderColor: watch('color') === c ? '#333' : '#ccc',
                },
              ]}
              onPress={() => setValue('color', c)}
            />
          ))}
        </View>

        <Text style={styles.label}>{t('choose-icon')}</Text>
        <View style={styles.iconList}>
          {ICONS.map(i => (
            <TouchableOpacity
              key={i}
              style={[
                styles.colorItem,
                {
                  backgroundColor:
                    watch('icon') === i ? watch('color') : '#ccc',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: watch('icon') === i ? 3 : 1,
                  borderColor: watch('icon') === i ? '#333' : '#ccc',
                },
              ]}
              onPress={() => setValue('icon', i)}
            >
              <Ionicons name={i} size={24} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>

        <ButtonCustom text={t('update')} onPress={handleSubmit(onSubmit)} />
        <OutlineButtonCustom text={t('delete')} onPress={confirmDelete} />
      </View>
    </View>
  );
};

export default CategoryEditScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 0, height: 100 },
  form: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1,
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    top: 50,
  },
  backButton: { position: 'absolute', left: 0, padding: 8 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  label: { fontWeight: 'bold', marginTop: 12, color: '#429690' },
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
  colorItem: { width: 40, height: 40, borderRadius: 20 },
  iconList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginVertical: 8,
  },
});

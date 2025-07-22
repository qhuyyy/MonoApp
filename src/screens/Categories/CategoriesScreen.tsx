import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect } from 'react';
import Rectangle from '../../assets/svg/Rectangle';
import categories from '../../assets/dummydata/categories';
import CategoryItem from '../../components/CategoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ButtonCustom from '../../components/ButtonCustom';

type CategoriesScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'Categories'
>;

const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  const clearCategoryStorage = async () => {
    try {
      await AsyncStorage.removeItem('category-storage');
      console.log('category-storage cleared');
    } catch (e) {
      console.error('Failed to clear category-storage:', e);
    }
  };

  useEffect(() => {
    const logStorageKeys = async () => {
      const keys = await AsyncStorage.getAllKeys();
      console.log('Storage Keys:', keys);

      const stores = await AsyncStorage.multiGet(keys);
      stores.forEach(([key, value]) => {
        console.log(`Key: ${key} => Value:`, value);
      });
    };

    logStorageKeys();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => navigation.navigate('AddNewCategory')}
        >
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ButtonCustom
        text="Clear Category Storage"
        onPress={clearCategoryStorage}
      />
    </View>
  );
};

export default CategoriesScreen;

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
    fontSize: 30,
    fontWeight: 'bold',
  },
  addIcon: {
    position: 'absolute',
    right: 16,
  },
  formContainer: {
    padding: 16,
    marginVertical: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 16,
    marginBottom: 6,
  },
});

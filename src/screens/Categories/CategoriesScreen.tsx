import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import Rectangle from '../../assets/svg/Rectangle';
import CategoryItem from '../../components/CategoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Category } from '../../types/types';
import { useFocusEffect } from '@react-navigation/native';
import { useCategoryStore } from '../../stores/useCategoryStore';

type CategoriesScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'Categories'
>;

const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = async () => {
    try {
      const storedData = await AsyncStorage.getItem('category-storage');
      if (storedData) {
        const parsed = JSON.parse(storedData);
        const allCategories: Category[] = parsed.state?.categories || [];
        setCategories(allCategories);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load categories from AsyncStorage:', error);
    }
  };

  const clearAllCategories = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc chắn muốn xoá toàn bộ danh mục?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: async () => {
          await useCategoryStore.persist.clearStorage();
          useCategoryStore.setState({ categories: [] });
          setCategories([]);
        },
      },
    ]);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, [])
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Categories</Text>
        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => navigation.navigate('CreateCategory')}
        >
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Income</Text>
          {categories.filter(c => c.status === 'income').length === 0 && (
            <Text style={styles.emptyText}>There is no Income's categories</Text>
          )}
          {categories
            .filter(cat => cat.status === 'income')
            .map((item, index) => (
              <CategoryItem
                key={item.id ?? index}
                category={item}
                onPress={() =>
                  navigation.navigate('UpdateCategory', { category: item })
                }
              />
            ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Expense</Text>
          {categories.filter(c => c.status === 'expense').length === 0 && (
            <Text style={styles.emptyText}>There is no Expense's categories</Text>
          )}
          {categories
            .filter(cat => cat.status === 'expense')
            .map((item, index) => (
              <CategoryItem
                key={item.id ?? index}
                category={item}
                onPress={() =>
                  navigation.navigate('UpdateCategory', { category: item })
                }
              />
            ))}
        </View>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllCategories}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
          <Text style={styles.clearButtonText}>Xoá toàn bộ danh mục</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7F7',
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
    fontSize: 26,
    fontWeight: 'bold',
  },
  addIcon: {
    position: 'absolute',
    right: 16,
  },
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  clearButton: {
    marginTop: 20,
    marginHorizontal: 16,
    backgroundColor: '#E74C3C',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '500',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#888',
    marginLeft: 5,
  },
});

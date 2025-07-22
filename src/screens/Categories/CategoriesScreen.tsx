import {
  Alert,
  Button,
  FlatList,
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
import ButtonCustom from '../../components/ButtonCustom';
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

  const handleClearCategories = async () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá toàn bộ danh mục?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await useCategoryStore.persist.clearStorage();
          useCategoryStore.setState({ categories: [] });
        },
      },
    ]);
  };

  // Load once on mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Load every time screen is focused
  useFocusEffect(
    useCallback(() => {
      loadCategories();
    }, []),
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
          {categories
            .filter(cat => cat.status === 'income')
            .map((item, index) => (
              <CategoryItem
                key={item.id ?? index}
                category={item}
                onPress={() =>
                  navigation.navigate({
                    name: 'UpdateCategory',
                    params: { category: item },
                  })
                }
              />
            ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Expense</Text>
          {categories
            .filter(cat => cat.status === 'expense')
            .map((item, index) => (
              <CategoryItem
                key={item.id ?? index}
                category={item}
                onPress={() =>
                  navigation.navigate({
                    name: 'UpdateCategory',
                    params: { category: item },
                  })
                }
              />
            ))}
        </View>
      </ScrollView>

      <Button title="Xóa toàn bộ danh mục" onPress={handleClearCategories} />
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
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
});

import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useEffect } from 'react';
import Rectangle from '../../assets/svg/Rectangle';
import CategoryItem from '../../components/CategoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useTranslation } from 'react-i18next';

type CategoriesScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'Categories'
>;

const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { categories, loadCategories } = useCategoryStore();

  useEffect(() => {
    loadCategories();
  }, []);

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
        <View>
          <Text style={[styles.title]}>{t('categories')}</Text>
          <Text style={styles.subTitle}>
            {t('press-into-the-categories-to-edit-or-delete!')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addIcon}
          onPress={() => navigation.navigate('CategoryCreate')}
        >
          <Ionicons name="add-circle-outline" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('income')}
          </Text>
          {categories.filter(c => c.status === 'income').length === 0 && (
            <Text style={styles.emptyText}>{t('no-income')}</Text>
          )}
          {categories
            .filter(cat => cat.status === 'income')
            .map((item, index) => (
              <CategoryItem
                key={item.id ?? index}
                category={item}
                onPress={() =>
                  navigation.navigate('CategoryEdit', { category: item })
                }
              />
            ))}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('expense')}
          </Text>
          {categories.filter(c => c.status === 'expense').length === 0 && (
            <Text style={styles.emptyText}>{t('no-expense')}</Text>
          )}
          {categories
            .filter(cat => cat.status === 'expense')
            .map((item, index) => (
              <CategoryItem
                key={item.id ?? index}
                category={item}
                onPress={() =>
                  navigation.navigate('CategoryEdit', { category: item })
                }
              />
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 0,
    height: 50,
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
    alignSelf: 'center',
  },
  subTitle: {
    color: 'white',
    fontSize: 14,
    fontStyle: 'italic',
    marginLeft: 10,
    marginTop: 5,
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
    width: '98%',
    alignSelf: 'center',
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

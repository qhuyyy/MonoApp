import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Animated,
  Alert,
  ScrollView,
} from 'react-native';
import Rectangle from '../../assets/svg/Rectangle';
import CategoryItem from '../../components/CategoryItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CategoriesStackParamList } from '../../navigations/CategoriesStack';
import { useFocusEffect, useTheme } from '@react-navigation/native';
import { useCategoryStore } from '../../stores/useCategoryStore';
import { useTranslation } from 'react-i18next';
import DraggableFlatList, {
  ScaleDecorator,
} from 'react-native-draggable-flatlist';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';

type CategoriesScreenProps = NativeStackScreenProps<
  CategoriesStackParamList,
  'Categories'
>;

const CategoriesScreen = ({ navigation }: CategoriesScreenProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { categories, loadCategories, updateCategoryOrder, deleteCategory } =
    useCategoryStore();
  const [loading, setLoading] = useState(true);

  const incomeCategories = categories.filter(c => c.status === 'income');
  const expenseCategories = categories.filter(c => c.status === 'expense');

  useEffect(() => {
    (async () => {
      setLoading(true);
      await loadCategories();
      setLoading(false);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setLoading(true);
        await loadCategories();
        setLoading(false);
      })();
    }, []),
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      t('delete'),
      t('are-you-sure-you-want-to-delete-this-category?'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => deleteCategory(id),
        },
      ],
    );
  };

  const renderRightActions =
    (item: any) => (progress: Animated.AnimatedInterpolation<number>) => {
      const trans1 = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
      });
      const trans2 = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [160, 0],
      });

      return (
        <View style={styles.actionContainer}>
          {/* Edit */}
          <Animated.View style={{ transform: [{ translateX: trans2 }] }}>
            <TouchableOpacity
              style={[
                styles.actionTouchableOpacity,
                { backgroundColor: '#FFA500' },
              ]}
              onPress={() =>
                navigation.navigate('CategoryEdit', { category: item })
              }
            >
              <Ionicons name="pencil-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          {/* Delete */}
          <Animated.View style={{ transform: [{ translateX: trans1 }] }}>
            <TouchableOpacity
              style={[
                styles.actionTouchableOpacity,
                { backgroundColor: '#9A031E' },
              ]}
              onPress={() => handleDelete(item.id)}
            >
              <Ionicons name="trash-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

  const openSwipeRef = useRef<Swipeable | null>(null);

  const renderItem = ({ item, drag, isActive }: any) => {
    const swipeableRef = useRef<Swipeable>(null);

    const closeSwipe = () => swipeableRef.current?.close();

    return (
      <ScaleDecorator>
        <Swipeable
          ref={swipeableRef}
          renderRightActions={renderRightActions(item)}
          rightThreshold={150}
          overshootRight={false}
          onSwipeableWillOpen={() => {
            if (
              openSwipeRef.current &&
              openSwipeRef.current !== swipeableRef.current
            ) {
              openSwipeRef.current.close();
            }
            openSwipeRef.current = swipeableRef.current;
          }}
          onSwipeableClose={() => {
            if (openSwipeRef.current === swipeableRef.current) {
              openSwipeRef.current = null;
            }
          }}
        >
          <View style={styles.itemRow}>
            <Pressable
              onLongPress={drag}
              style={styles.dragIconContainer}
              hitSlop={10}
            >
              <Ionicons name="reorder-three-outline" size={28} color="#888" />
            </Pressable>
            <TouchableOpacity
              style={[styles.itemContent, { opacity: isActive ? 0.7 : 1 }]}
              onPress={() => {
                closeSwipe();
                navigation.navigate('CategoryEdit', { category: item });
              }}
            >
              <CategoryItem category={item} />
            </TouchableOpacity>
          </View>
        </Swipeable>
      </ScaleDecorator>
    );
  };

  const handleIncomeReorder = (data: any[]) => {
    const newOrder = [...data, ...expenseCategories];
    updateCategoryOrder(newOrder);
  };

  const handleExpenseReorder = (data: any[]) => {
    const newOrder = [...incomeCategories, ...data];
    updateCategoryOrder(newOrder);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Income section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('income')}
          </Text>
          {incomeCategories.length === 0 ? (
            <Text style={styles.emptyText}>{t('no-income')}</Text>
          ) : (
            <DraggableFlatList
              data={incomeCategories}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              onDragEnd={({ data }) => handleIncomeReorder(data)}
              scrollEnabled={false} // <- Quan trọng để ScrollView cuộn, không để FlatList cuộn riêng
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>

        {/* Expense section */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('expense')}
          </Text>
          {expenseCategories.length === 0 ? (
            <Text style={styles.emptyText}>{t('no-expense')}</Text>
          ) : (
            <DraggableFlatList
              data={expenseCategories}
              keyExtractor={item => item.id.toString()}
              renderItem={renderItem}
              onDragEnd={({ data }) => handleExpenseReorder(data)}
              scrollEnabled={false} // <- Cũng tắt cuộn riêng
              contentContainerStyle={{ paddingBottom: 40 }}
            />
          )}
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default CategoriesScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 0, height: 50 },
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
  addIcon: { position: 'absolute', right: 16 },
  sectionContainer: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#ccc',
    fontSize: 16,
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3A837B',
  },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 4 },
  itemContent: { flex: 1 },
  dragIconContainer: { paddingHorizontal: 8, paddingVertical: 4 },
  actionContainer: {
    flexDirection: 'row',
    width: 120,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTouchableOpacity: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    aspectRatio: 1,
    borderRadius: 10,
    marginHorizontal: 3,
  },
});

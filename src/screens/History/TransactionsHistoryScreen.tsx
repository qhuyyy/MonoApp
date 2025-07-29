/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { useHistoryFilterStore } from '../../stores/useHistoryFilterStore';
import { Transaction } from '../../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HistoryStackParamList } from '../../navigations/HistoryStack';
import { windowHeight } from '../../utils/Dimensions';
import { useFocusEffect } from '@react-navigation/native';
import { PAGE_SIZE } from '../../constants/Category';
import { useTranslation } from 'react-i18next';

type HistoryScreenProps = NativeStackScreenProps<
  HistoryStackParamList,
  'TransactionsHistory'
>;

const TransactionsHistoryScreen = ({ navigation }: HistoryScreenProps) => {
  const { transactions, duplicateTransaction, loadTransactions } =
    useTransactionStore();

  const {
    search,
    filterType,
    sortBy,
    page,
    categories,
    selectedCategories,
    setSearch,
    setFilterType,
    setSortBy,
    toggleCategory,
    setCategories,
    setPage,
  } = useHistoryFilterStore();

  const swipeableRefs = useRef<Record<string, Swipeable | null>>({});
  const [refreshing, setRefreshing] = useState(false);

  const { t } = useTranslation();

  // Load categories từ AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem('category-storage').then(stored => {
      if (stored) {
        const parsed = JSON.parse(stored);
        setCategories(parsed.state?.categories || []);
      }
    });
  }, [setCategories]);

  // Refresh khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [loadTransactions]),
  );

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search.trim()) {
      result = result.filter(t =>
        t.description?.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (filterType !== 'all') {
      result = result.filter(t => t.category?.status === filterType);
    }
    if (selectedCategories.length > 0) {
      result = result.filter(
        t => t.category && selectedCategories.includes(t.category.id),
      );
    }
    if (sortBy === 'date') {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else if (sortBy === 'amount') {
      result.sort((a, b) => b.amount - a.amount);
    } else if (sortBy === 'updated') {
      result.sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );
    }
    return result;
  }, [transactions, search, filterType, sortBy, selectedCategories]);

  const data = filteredTransactions.slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    if (page * PAGE_SIZE < filteredTransactions.length) {
      setPage(page + 1);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleDelete = (id: string) => {
    Alert.alert(
      t('delete'),
      t('are-you-sure-you-want-to-delete-this-transaction?'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('delete'),
          style: 'destructive',
          onPress: () => useTransactionStore.getState().deleteTransaction(id),
        },
      ],
    );
  };

  const handleDuplicate = (id: string) => {
    Alert.alert(
      t('duplicate'),
      t('do-you-want-to-duplicate-this-transcation?'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('duplicate'),
          style: 'default',
          onPress: () => duplicateTransaction(id),
        },
      ],
    );
  };

  const handleSwipeableOpen = (id: string) => {
    Object.entries(swipeableRefs.current).forEach(([key, ref]) => {
      if (key !== id && ref) ref.close();
    });
  };

  const renderRightActions =
    (item: Transaction) =>
    (progress: Animated.AnimatedInterpolation<number>) => {
      const trans1 = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [80, 0],
      });
      const trans2 = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [160, 0],
      });
      const trans3 = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [240, 0],
      });

      return (
        <View style={styles.actionContainer}>
          <Animated.View style={{ transform: [{ translateX: trans3 }] }}>
            <TouchableOpacity
              style={[
                styles.actionTouchableOpacity,
                { backgroundColor: '#3A837B' },
              ]}
              onPress={() => handleDuplicate(item.id)}
            >
              <Ionicons name="copy-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={{ transform: [{ translateX: trans2 }] }}>
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

          <Animated.View style={{ transform: [{ translateX: trans1 }] }}>
            <TouchableOpacity
              style={[
                styles.actionTouchableOpacity,
                { backgroundColor: '#FFA500' },
              ]}
              onPress={() =>
                navigation.navigate('TransactionEdit', { transaction: item })
              }
            >
              <Ionicons name="pencil-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

  // Reset page khi filter thay đổi
  useEffect(() => {
    setPage(1);
  }, [search, filterType, sortBy, selectedCategories, setPage]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <Text style={styles.headerTitle}>{t('transactions-history')}</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder={t('search-description')}
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.title}>{t('status')}</Text>
        <View style={styles.filterBar}>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
            {['all', 'income', 'expense'].map(type => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  filterType === type && [
                    styles.filterActive,
                    type === 'income'
                      ? { backgroundColor: '#2E7D32' }
                      : type === 'expense'
                      ? { backgroundColor: '#9A031E' }
                      : { backgroundColor: '#666' },
                  ],
                ]}
                onPress={() => setFilterType(type as any)}
              >
                <Text
                  style={[
                    styles.filterText,
                    filterType === type && styles.filterTextActive,
                  ]}
                >
                  {t(type)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.sortTouchableOpacity}
            onPress={() => {
              const next =
                sortBy === 'date'
                  ? 'amount'
                  : sortBy === 'amount'
                  ? 'updated'
                  : 'date';
              setSortBy(next);
            }}
          >
            <Text style={styles.sortText}>
              {t('sort')}: {t(sortBy)}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>{t('categories')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.chip,
                selectedCategories.includes(cat.id) && styles.chipSelected,
              ]}
              onPress={() => toggleCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={18}
                color={selectedCategories.includes(cat.id) ? '#fff' : cat.color}
              />
              <Text
                style={[
                  styles.chipText,
                  selectedCategories.includes(cat.id) && { color: '#fff' },
                ]}
              >
                {t(cat.name.toLocaleLowerCase())}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.contentContainer}>
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeable
              ref={ref => {
                swipeableRefs.current[item.id] = ref;
              }}
              onSwipeableOpen={() => handleSwipeableOpen(item.id)}
              renderRightActions={renderRightActions(item)}
              overshootRight={false}
              rightThreshold={150}
            >
              <TransactionItem transaction={item} />
            </Swipeable>
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
        />
      </View>
    </View>
  );
};

export default TransactionsHistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: '#3A837B',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  title: { fontSize: 16, color: '#fff', fontStyle: 'italic' },
  searchContainer: { paddingHorizontal: 20, marginBottom: 5 },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterContainer: { paddingHorizontal: 20, justifyContent: 'space-around' },
  filterBar: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 1,
    borderWidth: 1,
    borderColor: '#3A837B',
  },
  filterActive: { backgroundColor: '#3A837B' },
  filterText: { fontSize: 14, fontWeight: '500', color: '#333' },
  filterTextActive: { color: '#fff' },
  sortTouchableOpacity: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD54F',
    borderRadius: 20,
    marginLeft: 'auto',
    width: 140,
    marginHorizontal: 4,
  },
  sortText: { fontWeight: 'bold', color: '#333', alignSelf: 'center' },
  contentContainer: {
    maxHeight: windowHeight - 450,
    marginTop: 10,
    paddingBottom: 10,
  },
  listContent: { marginTop: 10 },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    paddingBottom: 10,
  },
  actionContainer: {
    flexDirection: 'row',
    width: 160,
    height: 68,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 20,
  },
  actionTouchableOpacity: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    aspectRatio: 1,
    borderRadius: 10,
    marginHorizontal: 3,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#429690',
    margin: 3,
  },
  chipSelected: { backgroundColor: '#429690' },
  chipText: { marginLeft: 5, color: '#429690', fontWeight: '600' },
});

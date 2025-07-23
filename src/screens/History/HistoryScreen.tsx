/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { Transaction } from '../../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PAGE_SIZE = 4;

const HistoryScreen = () => {
  const transactions = useTransactionStore(state => state.transactions);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>(
    'all',
  );
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [page, setPage] = useState(1);

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

    if (sortBy === 'date') {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else {
      result.sort((a, b) => b.amount - a.amount);
    }

    return result;
  }, [transactions, search, filterType, sortBy]);

  const paginatedData = filteredTransactions.slice(0, page * PAGE_SIZE);

  const handleLoadMore = () => {
    if (page * PAGE_SIZE < filteredTransactions.length) {
      setPage(prev => prev + 1);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => useTransactionStore.getState().deleteTransaction(id),
      },
    ]);
  };

  const renderRightActions =
    (item: Transaction, handleDelete: (id: string) => void) =>
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
              onPress={() => Alert.alert('Duplicate')}
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
              onPress={() => Alert.alert('Edit')}
            >
              <Ionicons name="pencil-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

  useEffect(() => {
    setPage(1);
  }, [search, filterType, sortBy]);

  const data = useMemo(() => {
    return filteredTransactions.slice(0, page * PAGE_SIZE);
  }, [filteredTransactions, page]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <Text style={styles.headerTitle}>Transactions History</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search description..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Filter buttons */}
      <View style={styles.filterBar}>
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
              {type.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.sortTouchableOpacity}
          onPress={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
        >
          <Text style={styles.sortText}>Sort: {sortBy}</Text>
        </TouchableOpacity>
      </View>

      {/* Transaction list */}
      <View style={styles.contentContainer}>
        {' '}
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Swipeable
              renderRightActions={renderRightActions(item, handleDelete)}
              overshootRight={false}
              rightThreshold={150}
            >
              <TransactionItem transaction={item} />
            </Swipeable>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
        />
      </View>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#3A837B',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },

  searchContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 44,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
    marginHorizontal: 2,
    marginBottom: 6,
  },
  filterTouchableOpacity: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    marginRight: 8,
  },
  filterActive: {
    backgroundColor: '#3A837B',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  filterTextActive: {
    color: '#fff',
  },
  sortTouchableOpacity: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD54F',
    borderRadius: 20,
    marginLeft: 'auto',
    width: 110,
    marginHorizontal: 4,
    marginBottom: 6,
  },
  sortText: {
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
  },
  contentContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    marginTop: 10,
    borderRadius: 12,
    marginHorizontal: 15,
    elevation: 5,
  },
  listContent: {
    paddingBottom: 20,
    paddingHorizontal: 5,
    marginTop: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },

  actionContainer: {
    flexDirection: 'row',
    width: 180,
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
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

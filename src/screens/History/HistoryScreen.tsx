/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { Transaction } from '../../types/types';

const PAGE_SIZE = 10;

const HistoryScreen = () => {
  const transactions = useTransactionStore(state => state.transactions);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [page, setPage] = useState(1);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (search.trim()) {
      result = result.filter(t =>
        t.description?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== 'all') {
      result = result.filter(t => t.category?.status === filterType);
    }

    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
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

  const renderRightActions = (item: Transaction) => (
    <View style={{ flexDirection: 'row', width: 180 }}>
      <RectButton
        style={[styles.actionButton, { backgroundColor: '#FFA500' }]}
        onPress={() => Alert.alert('Edit', 'Feature not implemented yet')}
      >
        <Text style={styles.actionText}>Edit</Text>
      </RectButton>
      <RectButton
        style={[styles.actionButton, { backgroundColor: '#9A031E' }]}
        onPress={() => handleDelete(item.id)}
      >
        <Text style={styles.actionText}>Delete</Text>
      </RectButton>
      <RectButton
        style={[styles.actionButton, { backgroundColor: '#3A837B' }]}
        onPress={() =>
          Alert.alert('Duplicate', 'Feature not implemented yet')
        }
      >
        <Text style={styles.actionText}>Duplicate</Text>
      </RectButton>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <Text style={styles.headerTitle}>Transactions History</Text>
      </View>

      {/* Thanh tìm kiếm + lọc cơ bản */}
      <View style={styles.filterBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search description..."
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'all' && styles.filterActive,
          ]}
          onPress={() => setFilterType('all')}
        >
          <Text>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'income' && styles.filterActive,
          ]}
          onPress={() => setFilterType('income')}
        >
          <Text>Income</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterButton,
            filterType === 'expense' && styles.filterActive,
          ]}
          onPress={() => setFilterType('expense')}
        >
          <Text>Expense</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setSortBy(sortBy === 'date' ? 'amount' : 'date')}
        >
          <Text>Sort: {sortBy}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={paginatedData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <TransactionItem transaction={item} />
          </Swipeable>
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.emptyText}>No transactions found.</Text>}
      />
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#3A837B',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  filterBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
    height: 40,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#eee',
    marginHorizontal: 2,
  },
  filterActive: { backgroundColor: '#A5D6A7' },
  listContent: { paddingBottom: 40, paddingHorizontal: 10 },
  emptyText: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#999' },
  actionButton: { justifyContent: 'center', alignItems: 'center', width: 60 },
  actionText: { color: '#fff', fontWeight: 'bold' },
});

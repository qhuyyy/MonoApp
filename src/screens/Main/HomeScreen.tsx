/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useUserStore } from '../../stores/useUserStore';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { MainBottomTabsParamList } from '../../navigations/MainBottomTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Transaction } from '../../types/types';
import { Swipeable } from 'react-native-gesture-handler';

type NavigationProp = NativeStackNavigationProp<MainBottomTabsParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const fullName = useUserStore(state => state.fullName);

  const transactions = useTransactionStore(state => state.transactions);
  const loadRecentTransactions = useTransactionStore(
    state => state.loadRecentTransactions,
  );
  const recentTransactions = loadRecentTransactions();

  const deleteTransaction = useTransactionStore(
    state => state.deleteTransaction,
  );

  const [refreshing, setRefreshing] = useState(false);
  const [openRow, setOpenRow] = useState<Swipeable | null>(null);

  // load dữ liệu mỗi khi render
  useEffect(() => {
    loadRecentTransactions();
  }, [loadRecentTransactions]);

  const income = transactions
    .filter(t => t.category?.status === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.category?.status === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalBalance = income - expense;

  const handleDelete = (id: string) => {
    Alert.alert('Delete', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteTransaction(id),
      },
    ]);
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

      return (
        <View style={styles.actionContainer}>
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
                navigation.navigate('HistoryStack', {
                  screen: 'EditTransaction',
                  params: { transaction: item },
                })
              }
            >
              <Ionicons name="pencil-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      );
    };

  const handleSwipeableOpen = (ref: Swipeable) => {
    if (openRow && openRow !== ref) {
      openRow.close();
    }
    setOpenRow(ref);
  };

  const renderItem = useCallback(
    ({ item }: { item: Transaction }) => {
      let swipeableRef: Swipeable | null = null;
      return (
        <Swipeable
          ref={ref => {
            swipeableRef = ref;
          }}
          onSwipeableOpen={() =>
            swipeableRef && handleSwipeableOpen(swipeableRef)
          }
          renderRightActions={renderRightActions(item)}
          overshootRight={false}
          rightThreshold={150}
        >
          <TransactionItem transaction={item} />
        </Swipeable>
      );
    },
    [openRow],
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRecentTransactions();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <View style={{ paddingTop: 60, paddingHorizontal: 10 }}>
          <Text style={styles.welcome}>Good afternoon,</Text>
          <Text style={styles.name}>{fullName || 'User'}</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute', top: 70, right: 60 }}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={{ position: 'absolute', top: 70, right: 30 }}>
          <Ionicons name="settings-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Balance */}
      <View style={styles.balanceCard}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.balanceCardText}>Total Balance</Text>
            <Ionicons name="chevron-up-outline" size={16} color="#fff" />
          </View>
          <Text
            style={[
              styles.balanceCardText,
              { fontSize: 30, fontWeight: 'bold' },
            ]}
          >
            $ {totalBalance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.incomeExpense}>
          <View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={20}
                color="#fff"
              />
              <Text style={styles.balanceCardText}>Income</Text>
            </View>
            <Text
              style={[
                styles.balanceCardText,
                { fontWeight: 'bold', fontSize: 20 },
              ]}
            >
              $ {income.toFixed(2)}
            </Text>
          </View>
          <View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Ionicons name="arrow-up-circle-outline" size={20} color="#fff" />
              <Text style={styles.balanceCardText}>Expense</Text>
            </View>
            <Text
              style={[
                styles.balanceCardText,
                { fontWeight: 'bold', fontSize: 20 },
              ]}
            >
              $ {expense.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* Transactions */}
      <View style={styles.transactionContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.sectionTitle}>Transactions History</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('HistoryStack', { screen: 'History' })
            }
          >
            <Text style={{ fontStyle: 'italic' }}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={recentTransactions}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No transactions found.
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 20, paddingTop: 0, height: 287 },
  welcome: { color: '#fff', fontSize: 16 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  balanceCard: {
    backgroundColor: '#3A837B',
    height: 202,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    marginTop: -155,
    zIndex: 10,
    elevation: 5,
  },
  balanceCardText: { color: '#fff', fontSize: 16 },
  incomeExpense: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  transactionContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  actionContainer: {
    flexDirection: 'row',
    width: 150,
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
  listContent: { paddingBottom: 20, paddingHorizontal: 5, marginTop: 10 },
});

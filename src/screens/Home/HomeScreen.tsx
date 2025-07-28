/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  Alert,
  Pressable,
  RefreshControl,
  Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { LineChart } from 'react-native-chart-kit';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useUserStore } from '../../stores/useUserStore';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { MainBottomTabsParamList } from '../../navigations/MainBottomTabs';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { Transaction } from '../../types/types';
import { ScrollView, Swipeable } from 'react-native-gesture-handler';

const screenWidth = Dimensions.get('window').width;

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

  // Chi tiêu hôm nay
  const todayExpense = useMemo(() => {
    const today = new Date().toDateString();
    return transactions
      .filter(
        t =>
          t.category?.status === 'expense' &&
          new Date(t.date).toDateString() === today,
      )
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const monthExpense = useMemo(() => {
    const now = new Date();
    return transactions
      .filter(t => {
        const d = new Date(t.date);
        return (
          t.category?.status === 'expense' &&
          d.getMonth() === now.getMonth() &&
          d.getFullYear() === now.getFullYear()
        );
      })
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const chartData = useMemo(() => {
    const labels: string[] = [];
    const data: number[] = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const label = `${d.getDate()}/${d.getMonth() + 1}`;
      labels.push(label);
      const dailyExpense = transactions
        .filter(
          t =>
            t.category?.status === 'expense' &&
            new Date(t.date).toDateString() === d.toDateString(),
        )
        .reduce((sum, t) => sum + t.amount, 0);
      data.push(dailyExpense);
    }
    return {
      labels,
      datasets: [{ data, color: () => '#FF7043' }],
    };
  }, [transactions]);

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
                  screen: 'TransactionEdit',
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
          containerStyle={{ marginTop: 2 }}
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
    <FlatList
      data={recentTransactions}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      contentContainerStyle={{
        paddingBottom: 20,
      }}
      ListHeaderComponent={
        <>
          {/* Header */}
          <View style={styles.header}>
            <Rectangle style={StyleSheet.absoluteFillObject} />
            <View style={{ paddingTop: 60, paddingHorizontal: 10 }}>
              <Text style={styles.welcome}>Good afternoon,</Text>
              <Text style={styles.name}>{fullName || 'User'}</Text>
            </View>
            <TouchableOpacity
              style={{ position: 'absolute', top: 70, right: 60 }}
            >
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ position: 'absolute', top: 70, right: 30 }}
            >
              <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Balance */}
          <Pressable
            style={styles.balanceCard}
            onPress={() => navigation.navigate('Statistics')}
          >
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            >
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
                  <Ionicons
                    name="arrow-up-circle-outline"
                    size={20}
                    color="#fff"
                  />
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
          </Pressable>

          {/* Quick stats */}
          <View style={styles.quickStats}>
            <View style={[styles.quickCard, { backgroundColor: '#EB9486' }]}>
              <Text style={styles.quickLabel}>Today Expense</Text>
              <Text style={styles.quickValue}>${todayExpense.toFixed(2)}</Text>
            </View>
            <View style={[styles.quickCard, { backgroundColor: '#FF9F1C' }]}>
              <Text style={styles.quickLabel}>Month Expense</Text>
              <Text style={styles.quickValue}>${monthExpense.toFixed(2)}</Text>
            </View>
          </View>

          {/* Mini chart */}
          <View style={styles.chartCard}>
            <Text style={styles.sectionTitle}>7-day Expense Trend</Text>
            <LineChart
              data={chartData}
              width={screenWidth - 40}
              height={180}
              withDots
              withInnerLines={false}
              chartConfig={{
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                color: (opacity = 1) => `rgba(255, 112, 67, ${opacity})`,
              }}
              bezier
              style={{ borderRadius: 10, marginTop: 10 }}
            />
          </View>

          {/* Title */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 20,
              marginTop: 20,
            }}
          >
            <Text style={styles.sectionTitle}>Transactions History</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HistoryStack', {
                  screen: 'TransactionsHistory',
                })
              }
            >
              <Text style={{ fontStyle: 'italic' }}>See all</Text>
            </TouchableOpacity>
          </View>
        </>
      }
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 20 }}>
          No transactions found.
        </Text>
      }
    />
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
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 20,
  },
  quickCard: {
    flex: 1,

    marginHorizontal: 5,
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  quickLabel: { fontSize: 14, color: '#333' },
  quickValue: { fontSize: 18, fontWeight: 'bold', marginTop: 5 },
  chartCard: { marginTop: 20, paddingHorizontal: 20 },
  transactionContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600' },
  actionContainer: {
    flexDirection: 'row',
    width: 120,
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
  listContent: { paddingBottom: 20, paddingHorizontal: 5, marginTop: 10 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
  },
  actionBtnText: { color: '#fff', marginLeft: 5, fontWeight: 'bold' },
});

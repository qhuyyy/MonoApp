/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet, Text, View, FlatList, SafeAreaView } from 'react-native';
import React from 'react';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useTransactionStore } from '../../stores/useTransactionStore';

const HistoryScreen = () => {
  const transactions = useTransactionStore(state => state.transactions);

  return (
    <View style={styles.container}>
      {/* Header background */}
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <Text style={styles.headerTitle}>Transactions History</Text>
      </View>

      <SafeAreaView style={styles.listTransactions}>
        <FlatList
          data={transactions.slice().reverse()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No transactions found.</Text>
          }
        />
      </SafeAreaView>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingBottom: 20,
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
  listContent: {
    paddingBottom: 40,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#999',
  },
  listTransactions: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
    elevation: 10,
    paddingVertical: 20,
  },
});

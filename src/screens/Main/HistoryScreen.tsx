/* eslint-disable @typescript-eslint/no-unused-vars */
import { StyleSheet, Text, View, FlatList } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import transactions from '../../assets/dummydata/transactions';
import TransactionItem from '../../components/TransactionItem';
const HistoryScreen = () => {
  return (
    <SafeAreaView>
      <Text>All the Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TransactionItem
            image={item.image}
            description={item.description}
            date={item.date}
            amount={item.amount}
            isIncome={item.status_id === 1}
          />
        )}
        contentContainerStyle={{ paddingTop: 10 }}
      />
    </SafeAreaView>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({});

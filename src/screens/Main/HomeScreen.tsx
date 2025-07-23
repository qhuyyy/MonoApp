/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Rectangle from '../../assets/svg/Rectangle';
import TransactionItem from '../../components/TransactionItem';
import { useUserStore } from '../../stores/useUserStore';
import { useTransactionStore } from '../../stores/useTransactionStore';

export default function HomeScreen() {
  const fullName = useUserStore(state => state.fullName);
  const transactions = useTransactionStore(state => state.transactions);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <View style={{ paddingTop: 60, paddingHorizontal: 10 }}>
          <Text style={styles.welcome}>Good afternoon,</Text>
          <Text style={styles.name}>{fullName || 'User'}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons
            name="notifications-outline"
            size={24}
            color="#fff"
            style={{ position: 'absolute', top: -35, right: 40 }}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons
            name="settings-outline"
            size={24}
            color="#fff"
            style={{ position: 'absolute', top: -35, right: 10 }}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.totalBalance}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={styles.balanceCardText}>Total Balance</Text>
            <Ionicons name="chevron-up-outline" size={16} color="#fff" />
          </View>
          <View>
            <Text
              style={[
                styles.balanceCardText,
                { fontSize: 30, fontWeight: 'bold' },
              ]}
            >
              $ 2,548.00
            </Text>
          </View>
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
            <View style={{ marginHorizontal: 5 }}>
              <Text
                style={[
                  styles.balanceCardText,
                  { fontWeight: 'bold', fontSize: 20 },
                ]}
              >
                $ 1,840.00
              </Text>
            </View>
          </View>
          <View>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
            >
              <Ionicons name="arrow-up-circle-outline" size={20} color="#fff" />
              <Text style={styles.balanceCardText}>Expense</Text>
            </View>
            <View style={{ marginHorizontal: 5 }}>
              <Text
                style={[
                  styles.balanceCardText,
                  { fontWeight: 'bold', fontSize: 20 },
                ]}
              >
                $ 284.00
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.transactionContainer}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text style={styles.sectionTitle}>Transactions History</Text>
          <TouchableOpacity>
            <Text style={{ fontStyle: 'italic' }}>See all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={transactions.slice().reverse()}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          contentContainerStyle={{ paddingTop: 10 }}
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 0,
    height: 287,
  },
  welcome: {
    color: '#fff',
    fontSize: 16,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
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
  balanceCardText: {
    color: '#fff',
    fontSize: 16,
  },
  totalBalance: {},
  incomeExpense: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
  },
  transactionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
});

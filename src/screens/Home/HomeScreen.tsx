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
import transactions from '../../assets/dummydata/transactions';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
        <View style={{ paddingTop: 60, paddingHorizontal: 10 }}>
          <Text style={styles.welcome}>Good afternoon,</Text>
          <Text style={styles.name}>Enjelin Morgeana</Text>
        </View>
        <Ionicons
          name="notifications-outline"
          size={24}
          color="#fff"
          style={{ position: 'absolute', top: 60, right: 20 }}
        />
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
        <Text style={styles.sectionTitle}>Transactions History</Text>
        <FlatList
          data={transactions}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <TransactionItem
              image={item.image}
              description={item.description}
              date={item.date}
              amount={item.amount}
              isIncome={item.status_id === 1} // status_id 1 = income
            />
          )}
          contentContainerStyle={{ paddingTop: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F3F2',
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

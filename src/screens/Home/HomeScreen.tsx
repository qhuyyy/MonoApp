/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header & Balance Card */}
      <View style={styles.header}>
        <Text style={styles.welcome}>Good afternoon,</Text>
        <Text style={styles.name}>Enjelin Morgeana</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.label}>Total Balance</Text>
        <Text style={styles.amount}>$2,548.00</Text>
        <View style={styles.incomeExpenses}>
          <Text style={{ color: '#fff' }}>Income: $1,840.00</Text>
          <Text style={{ color: '#fff' }}>Expenses: $284.00</Text>
        </View>
      </View>

      {/* Danh sách giao dịch */}
      <View style={styles.transactionContainer}>
        <Text style={styles.sectionTitle}>Transactions History</Text>
        {/* render các transaction tại đây */}
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
    paddingTop: 60,
    backgroundColor: '#549994',
    height: 287
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
    marginTop: -100,
    zIndex: 10,
    elevation: 5, 
  },
  label: {
    color: '#fff',
    marginBottom: 8,
  },
  amount: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  incomeExpenses: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  transactionContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    backgroundColor: '#549994',
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 1,
  },
});

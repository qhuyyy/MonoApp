import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { isToday, isYesterday, format } from 'date-fns';
import { Transaction } from '../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

type TransactionItemProps = {
  transaction: Transaction;
};

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  if (!transaction) return null;

  const { amount, category, description, date } = transaction;

  const parsedDate = new Date(date);
  const displayDate = isToday(parsedDate)
    ? 'Today'
    : isYesterday(parsedDate)
    ? 'Yesterday'
    : format(parsedDate, 'dd MMM yyyy');

  const isIncome = category.status === 'income';

  return (
    <TouchableOpacity style={[styles.container, {borderColor: category.color || '#ccc'}]}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={category.icon}
          size={32}
          color={category.color}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text
          style={styles.descriptionText}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {description ? description : 'No description yet'}
        </Text>
        <Text>{displayDate}</Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isIncome ? 'green' : 'red' }]}>
          {isIncome ? '+' : '-'} ${amount.toFixed(2)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransactionItem;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
    // backgroundColor: 'pink',
    borderWidth: 2,
    borderRadius: 10,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  descriptionText: {
    fontStyle: 'italic',
    color: '#888',
    fontSize: 13,
    maxWidth: 150,
  },
  amountContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

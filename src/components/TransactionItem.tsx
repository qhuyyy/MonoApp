import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { isToday, isYesterday, format } from 'date-fns';
import { Transaction } from '../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';

type TransactionItemProps = {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
};

const TransactionItem = ({ transaction, onPress }: TransactionItemProps) => {
  if (!transaction) return null;

  const { colors } = useTheme();

  const { amount, category, description, date, created_at } = transaction;

  let displayDate = '';
  if (created_at) {
    const parsedDate = new Date(created_at);
    displayDate = isToday(parsedDate)
      ? 'Today'
      : isYesterday(parsedDate)
      ? 'Yesterday'
      : format(parsedDate, 'dd MMM yyyy');
  }

  const formattedDate = date ? format(new Date(date), 'MMMM dd, yyyy') : '';

  const isIncome = category.status === 'income';

  return (
    <TouchableOpacity
      style={[styles.container, { borderColor: category.color || '#ccc' }]}
      onPress={onPress ? () => onPress(transaction) : undefined}
    >
      <View style={styles.iconContainer}>
        <Ionicons name={category.icon} size={28} color={category.color} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {category.name} ({formattedDate})
        </Text>
        <Text
          style={[styles.descriptionText, { color: colors.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {description ? description : 'No description yet'}
        </Text>
        <Text style={styles.timeText}>Last update: {displayDate}</Text>
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
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
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
  dateText: {
    fontSize: 14,
    maxWidth: 150,
  },
  descriptionText: {
    fontSize: 14,
    maxWidth: 150,
  },
  timeText: {
    color: '#888',
    fontStyle: 'italic',
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

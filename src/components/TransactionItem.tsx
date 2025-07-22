import { Image, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { isToday, isYesterday, format } from 'date-fns';

type TransactionItemProps = {
  image: string;
  description: string;
  date: string;
  amount: number;
  isIncome: boolean;
};

const TransactionItem = ({
  image,
  description,
  date,
  amount,
  isIncome,
}: TransactionItemProps) => {
  const defaultImage = require('../assets/image/money.png');

  const parsedDate = new Date(date);
  const displayDate = isToday(parsedDate)
    ? 'Today'
    : isYesterday(parsedDate)
    ? 'Yesterday'
    : format(parsedDate, 'dd MMM yyyy');

  return (
    <TouchableOpacity style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={image ? { uri: image } : defaultImage}
          style={{ width: 50, height: 50, borderRadius: 10 }}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.description}>{description ?? 'No description'}</Text>
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
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  imageContainer: {},
  infoContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  description: {
    fontSize: 16,
    fontWeight: '600',
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

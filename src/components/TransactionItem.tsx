import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { isToday, isYesterday, format } from 'date-fns';
import { Transaction } from '../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useUserStore } from '../stores/useUserStore';
import { currencySymbols } from '../constants/Transactions';

type TransactionItemProps = {
  transaction: Transaction;
};

const TransactionItem = ({ transaction }: TransactionItemProps) => {
  if (!transaction) return null;

  const { colors } = useTheme();
  const { t } = useTranslation();
  const { currency } = useUserStore();
  const { amount, category, description, date, updated_at } = transaction;

  let displayDate = '';
  if (updated_at) {
    const parsedDate = new Date(updated_at);
    displayDate = isToday(parsedDate)
      ? t('today')
      : isYesterday(parsedDate)
      ? t('yesterday')
      : format(parsedDate, 'dd/MM/yyyy');
  }

  const formattedDate = date ? format(new Date(date), 'dd/MM/yyyy') : '';
  const isIncome = category.status === 'income';

  const currencySymbol = currencySymbols[currency] || currency;

  return (
    <View style={[styles.container, { borderColor: category.color || '#ccc' }]}>
      <View style={styles.iconContainer}>
        <Ionicons name={category.icon} size={28} color={category.color} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.categoryName, { color: colors.text }]}>
          {t(category.name.toLocaleLowerCase())} ({formattedDate})
        </Text>
        <Text
          style={[styles.descriptionText, { color: colors.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {description ? description : t('no-description-yet')}
        </Text>
        <Text style={styles.timeText}>
          {t('last-updated')} {displayDate}
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <Text style={[styles.amount, { color: isIncome ? 'green' : 'red' }]}>
          {isIncome ? '+' : '-'} {amount.toFixed(2)} {currencySymbol}
        </Text>
      </View>
    </View>
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

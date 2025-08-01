import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { Category } from '../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTranslation } from 'react-i18next';

type Props = {
  category: Category;
};

const CategoryItem = ({ category }: Props) => {
  const { t } = useTranslation();

  return (
    <View
      style={[styles.container, { backgroundColor: category.color }]}
    >
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {t(category.name.toLowerCase(), category.name)}
        </Text>
        <Text style={styles.subText}>{t(category.status.toLowerCase(), category.status)}</Text>
      </View>
      <Ionicons name={category.icon} size={30} color="white" />
    </View>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 10,
  },
  textContainer: {
    flexDirection: 'column',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  subText: {
    fontSize: 14,
    color: 'white',
  },
});

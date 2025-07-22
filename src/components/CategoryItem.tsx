import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { Category } from '../types/types';

type Props = {
  category: Category;
  onPress?: () => void;
};

const CategoryItem = ({ category, onPress }: Props) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: category.color }]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.text}>{category.name}</Text>
        <Text style={styles.subText}>{category.status}</Text>
      </View>
      <View></View>
    </TouchableOpacity>
  );
};

export default CategoryItem;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
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

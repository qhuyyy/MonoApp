import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Category } from '../types/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

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
      <View style={styles.textContainer}>
        <Text style={styles.text}>{category.name}</Text>
        <Text style={styles.subText}>{category.status}</Text>
      </View>
      <Ionicons name={category.icon} size={30} color="white" />
    </TouchableOpacity>
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

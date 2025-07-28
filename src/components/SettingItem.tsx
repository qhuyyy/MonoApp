import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SettingItemProps = {
  title: string;
  onPress?: () => void;
};

const SettingItem = ({ title, onPress }: SettingItemProps) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Ionicons name="chevron-forward-outline" size={22} color="#666" />
    </TouchableOpacity>
  );
};

export default SettingItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  title: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainBottomTabsParamList } from '../../navigations/MainBottomTabs';
import { useNavigation } from '@react-navigation/native';

import { windowWidth } from '../../utils/Dimensions';
import IncomeTab from './IncomeTab';
import ExpenseTab from './ExpenseTab';

type CreateTransNavigationProp = NativeStackNavigationProp<
  MainBottomTabsParamList,
  'TransactionCreate'
>;

export default function TransactionCreateScreen() {
  const [activeTab, setActiveTab] = useState<'Income' | 'Expense'>('Income');
  const navigation = useNavigation<CreateTransNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />

        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back-outline" size={24} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add a new Transaction</Text>
        </View>
      </View>

      <View style={styles.mainContent}>
        <View style={styles.tabSwitcher}>
          <Pressable
            onPress={() => setActiveTab('Income')}
            style={[
              styles.tabItem,
              activeTab === 'Income' && { backgroundColor: '#2e7d32' },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Income' && { color: '#fff', fontWeight: 'bold' },
              ]}
            >
              Income
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab('Expense')}
            style={[
              styles.tabItem,
              activeTab === 'Expense' && { backgroundColor: '#9A031E' },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Expense' && {
                  color: '#fff',
                  fontWeight: 'bold',
                },
              ]}
            >
              Expense
            </Text>
          </Pressable>
        </View>

        {activeTab === 'Income' ? <IncomeTab /> : <ExpenseTab />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    paddingTop: 40,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#00856F',
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  mainContent: {
    flex: 1,
    borderTopStartRadius: 24,
    borderTopEndRadius: 24,
    gap: 20,
  },
  tabSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#F0F3F4',
    borderRadius: 24,
    padding: 4,
    alignSelf: 'center',
    width: windowWidth * 0.6,
    marginBottom: 24,
    marginTop: 20,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    color: '#5B5B5B',
    fontSize: 14,
    fontWeight: '500',
  },
});

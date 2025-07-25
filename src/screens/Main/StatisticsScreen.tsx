import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import Rectangle from '../../assets/svg/Rectangle';
import { useTransactionStore } from '../../stores/useTransactionStore';
import { Picker } from '@react-native-picker/picker';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#f5f5f5',
  color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
};

const StatisticsScreen = () => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [period, setPeriod] = useState<'month' | '3months' | 'year'>('month');
  const { transactions } = useTransactionStore();

  const cyclePeriod = () => {
    setPeriod(prev =>
      prev === 'month' ? '3months' : prev === '3months' ? 'year' : 'month',
    );
  };

  // --- Filter by period ---
  const filtered = useMemo(() => {
    const now = new Date();
    let startDate = new Date();

    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === '3months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    return transactions.filter(
      t => new Date(t.date).getTime() >= startDate.getTime(),
    );
  }, [transactions, period]);

  // --- Bar Chart ---
  const barData = useMemo(() => {
    const labels: string[] = [];
    const expenseArr: number[] = [];

    const now = new Date();
    let startDate = new Date();
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === '3months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const tempDate = new Date(startDate);
    while (tempDate <= now) {
      labels.push(`${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`);
      expenseArr.push(0);
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    filtered.forEach(t => {
      const d = new Date(t.date);
      const label = `${d.getMonth() + 1}/${d.getFullYear()}`;
      const idx = labels.indexOf(label);
      if (idx >= 0 && t.category?.status === 'expense') {
        expenseArr[idx] += t.amount;
      }
    });

    return {
      labels,
      datasets: [{ data: expenseArr, color: () => '#FF7043' }],
      legend: ['Expense'],
    };
  }, [filtered, period]);

  // --- Line Chart ---
  const lineData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    if (period === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === '3months') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    } else {
      startDate = new Date(now.getFullYear(), 0, 1);
    }

    const labels: string[] = [];
    const incomeArr: number[] = [];
    const expenseArr: number[] = [];
    const tempDate = new Date(startDate);

    while (tempDate <= now) {
      labels.push(`${tempDate.getMonth() + 1}/${tempDate.getFullYear()}`);
      incomeArr.push(0);
      expenseArr.push(0);
      tempDate.setMonth(tempDate.getMonth() + 1);
    }

    filtered.forEach(t => {
      const d = new Date(t.date);
      const label = `${d.getMonth() + 1}/${d.getFullYear()}`;
      const idx = labels.indexOf(label);
      if (idx >= 0) {
        if (t.category?.status === 'income') incomeArr[idx] += t.amount;
        if (t.category?.status === 'expense') expenseArr[idx] += t.amount;
      }
    });

    return {
      labels,
      datasets: [
        { data: incomeArr, color: () => '#4CAF50' },
        { data: expenseArr, color: () => '#FF7043' },
      ],
      legend: ['Income', 'Expense'],
    };
  }, [filtered, period]);

  const { incomePieData, expensePieData } = useMemo(() => {
    const incomeMap: Record<string, number> = {};
    const expenseMap: Record<string, number> = {};
    const incomeColor: Record<string, string> = {};
    const expenseColor: Record<string, string> = {};

    filtered.forEach(t => {
      if (!t.category) return;
      if (t.category.status === 'income') {
        incomeMap[t.category.name] =
          (incomeMap[t.category.name] || 0) + t.amount;
        incomeColor[t.category.name] = t.category.color;
      } else if (t.category.status === 'expense') {
        expenseMap[t.category.name] =
          (expenseMap[t.category.name] || 0) + t.amount;
        expenseColor[t.category.name] = t.category.color;
      }
    });

    return {
      incomePieData: Object.keys(incomeMap).map(key => ({
        name: key,
        population: incomeMap[key],
        color: incomeColor[key] || '#ccc',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      })),
      expensePieData: Object.keys(expenseMap).map(key => ({
        name: key,
        population: expenseMap[key],
        color: expenseColor[key] || '#ccc',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      })),
    };
  }, [filtered]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Rectangle />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.headerTitle}>Statistics & Report</Text>
        <View style={styles.switchContainer}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={chartType}
              style={styles.picker}
              onValueChange={itemValue => setChartType(itemValue)}
              dropdownIconColor="#429690"
            >
              <Picker.Item label="Monthly Expenses" value="bar" />
              <Picker.Item label="Income vs Expense Trend" value="line" />
              <Picker.Item label="Category Breakdown" value="pie" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.sortButton} onPress={cyclePeriod}>
            <Text style={styles.sortText}>
              {period === 'month'
                ? 'This Month'
                : period === '3months'
                ? 'Last 3 Months'
                : 'This Year'}
            </Text>
          </TouchableOpacity>
        </View>

        {chartType === 'bar' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Expenses Bar Chart</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <BarChart
                data={barData}
                width={Math.max(screenWidth, barData.labels.length * 5)}
                height={260}
                fromZero
                yAxisSuffix=""
                yAxisLabel="$"
                chartConfig={chartConfig}
                style={styles.chart}
              />
            </ScrollView>
          </View>
        )}

        {chartType === 'line' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Income & Expense Trend Line Chart
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <LineChart
                data={lineData}
                width={Math.max(screenWidth, lineData.labels.length * 5)}
                height={260}
                chartConfig={chartConfig}
                yAxisLabel="$"
                bezier
                style={styles.chart}
              />
            </ScrollView>
          </View>
        )}

        {chartType === 'pie' && (
          <>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Income by Category</Text>
              {incomePieData.length > 0 ? (
                <PieChart
                  data={incomePieData}
                  width={screenWidth - 16}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={'population'}
                  
                  backgroundColor={'transparent'}
                  paddingLeft={'15'}
                  absolute
                />
              ) : (
                <Text style={styles.emptyText}>No income data</Text>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Expense by Category</Text>
              {expensePieData.length > 0 ? (
                <PieChart
                  data={expensePieData}
                  width={screenWidth}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={'population'}
                  backgroundColor={'transparent'}
                  paddingLeft={'15'}
                  absolute
                />
              ) : (
                <Text style={styles.emptyText}>No expense data</Text>
              )}
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7F7' },
  header: { height: 50, justifyContent: 'center' },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  sortButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD54F',
    borderRadius: 20,
  },
  sortText: { fontWeight: 'bold', color: '#333' },
  contentContainer: { paddingHorizontal: 20 },
  pickerContainer: {
    flex: 1,
    maxWidth: 240,
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 20,
    marginRight: 10,
    overflow: 'hidden',
  },
  picker: { height: 52, width: '100%', color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  chart: { borderRadius: 12 },
  emptyText: { textAlign: 'center', marginVertical: 10, color: '#777' },
});

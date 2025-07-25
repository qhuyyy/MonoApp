import React, { useState, useMemo, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';
import Rectangle from '../../assets/svg/Rectangle';
import { useTransactionStore } from '../../stores/useTransactionStore';

import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';

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
  const chartRef = useRef<ViewShot>(null);

  const cyclePeriod = () => {
    setPeriod(prev =>
      prev === 'month' ? '3months' : prev === '3months' ? 'year' : 'month',
    );
  };

  // --- Filter data by period ---
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

  // --- Bar Chart data ---
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

  // --- Line Chart data ---
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

  // --- Pie chart data ---
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

  const PieLegend = ({ data }: { data: any[] }) => (
    <View style={styles.legendContainer}>
      {data.map(item => (
        <View key={item.name} style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: item.color }]} />
          <Text style={styles.legendText}>{item.name}</Text>
        </View>
      ))}
    </View>
  );

  // --- Share chart image ---
  const shareChart = async () => {
    try {
      const uri = await chartRef.current?.capture?.();
      if (!uri) return;
      await Share.open({
        url: `file://${uri}`,
        type: 'image/png',
        failOnCancel: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  // --- Export CSV ---
  const exportCSV = async () => {
    const csv = Papa.unparse(
      filtered.map(t => ({
        Date: t.date,
        Category: t.category?.name || '',
        Type: t.category?.status || '',
        Amount: t.amount,
      })),
    );

    const path = `${RNFS.DocumentDirectoryPath}/transactions.csv`;
    await RNFS.writeFile(path, csv, 'utf8');

    await Share.open({
      url: `file://${path}`,
      type: 'text/csv',
      failOnCancel: false,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Rectangle style={styles.rectangleBackground} />
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

        {/* Export buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={shareChart} style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Chia sẻ biểu đồ</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={exportCSV} style={styles.exportButton}>
            <Text style={styles.exportButtonText}>Xuất CSV</Text>
          </TouchableOpacity>
        </View>

        <ViewShot ref={chartRef} options={{ format: 'png', quality: 0.9 }}>
          {chartType === 'bar' && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Monthly Expenses Bar Chart</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={barData}
                  width={Math.max(screenWidth - 40, barData.labels.length * 60)}
                  height={260}
                  fromZero
                  yAxisLabel="$"
                  yAxisSuffix=""
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
                  width={Math.max(
                    screenWidth - 40,
                    lineData.labels.length * 60,
                  )}
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
                <PieChart
                  data={incomePieData}
                  width={200}
                  height={180}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="50"
                  hasLegend={false}
                  absolute
                />
                <PieLegend data={incomePieData} />
              </View>

              <View style={styles.card}>
                <Text style={styles.cardTitle}>Expense by Category</Text>
                <PieChart
                  data={expensePieData}
                  width={200}
                  height={180}
                  chartConfig={chartConfig}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="50"
                  hasLegend={false}
                  absolute
                />
                <PieLegend data={expensePieData} />
              </View>
            </>
          )}
        </ViewShot>
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F7F7' },
  rectangleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  sortButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD54F',
    borderRadius: 20,
  },
  sortText: { fontWeight: 'bold', color: '#333' },
  contentContainer: { paddingHorizontal: 20, top: 50 },
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
    alignItems: 'center',
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  chart: { borderRadius: 12 },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  exportButtonText: { color: '#fff', fontWeight: '600' },
  legendContainer: {
    marginTop: 10,
    width: '90%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendColor: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginRight: 8,
  },
  legendText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
});

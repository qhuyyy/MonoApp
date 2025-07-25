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

        {chartType === 'bar' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Monthly Expenses Bar Chart</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chartWrapper}>
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
              </View>
            </ScrollView>
          </View>
        )}

        {chartType === 'line' && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              Income & Expense Trend Line Chart
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chartWrapper}>
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
              </View>
            </ScrollView>
          </View>
        )}

        {chartType === 'pie' && (
          <>
            <View
              style={[
                styles.card,
                { alignItems: 'center', justifyContent: 'center' },
              ]}
            >
              <Text style={styles.cardTitle}>Income by Category</Text>
              {incomePieData.length > 0 ? (
                <>
                  <View style={styles.pieChartCenter}>
                    <View style={styles.pieChartWrapper}>
                      <PieChart
                        data={incomePieData}
                        width={200} // nhỏ hơn, cố định
                        height={180}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="50"
                        hasLegend={false}
                        absolute
                      />
                    </View>
                  </View>
                  <View style={styles.legendContainer}>
                    {incomePieData.map(item => (
                      <View key={item.name} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendColor,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text style={styles.legendText}>{item.name}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <Text style={styles.emptyText}>No income data</Text>
              )}
            </View>

            <View
              style={[
                styles.card,
                { alignItems: 'center', justifyContent: 'center' },
              ]}
            >
              <Text style={styles.cardTitle}>Expense by Category</Text>
              {expensePieData.length > 0 ? (
                <>
                  <View style={styles.pieChartCenter}>
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
                  </View>
                  <View style={styles.legendContainer}>
                    {expensePieData.map(item => (
                      <View key={item.name} style={styles.legendItem}>
                        <View
                          style={[
                            styles.legendColor,
                            { backgroundColor: item.color },
                          ]}
                        />
                        <Text style={styles.legendText}>{item.name}</Text>
                      </View>
                    ))}
                  </View>
                </>
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
  container: {
    flex: 1,
    backgroundColor: '#F2F7F7',
  },
  rectangleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    justifyContent: 'space-around',
  },
  pickerContainer: {
    flex: 1,
    maxWidth: 240,
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 20,
    marginRight: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 52,
    width: '100%',
    color: '#333',
  },
  sortButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD54F',
    borderRadius: 20,
  },
  sortText: {
    fontWeight: 'bold',
    color: '#333',
  },
  contentContainer: {
    paddingHorizontal: 20,
    top: 50,
  },
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
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chart: {
    borderRadius: 12,
  },
  pieChartCenter: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  pieChartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#777',
  },
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

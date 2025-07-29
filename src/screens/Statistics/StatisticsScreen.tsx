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
import Ionicons from 'react-native-vector-icons/Ionicons';
import ViewShot from 'react-native-view-shot';
import Share from 'react-native-share';
import RNFS from 'react-native-fs';
import Papa from 'papaparse';
import { windowHeight } from '../../utils/Dimensions';
import { useTheme } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainBottomTabsParamList } from '../../navigations/MainBottomTabs';
import { useTranslation } from 'react-i18next';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#f5f5f5',
  backgroundGradientTo: '#f5f5f5',
  color: (opacity = 1) => `rgba(63, 81, 181, ${opacity})`,
};

type StatisticsScreenProp = NativeStackScreenProps<
  MainBottomTabsParamList,
  'Statistics'
>;

const StatisticsScreen = ({ navigation }: StatisticsScreenProp) => {
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [period, setPeriod] = useState<'month' | '3months' | 'year'>('3months');
  const { transactions } = useTransactionStore();
  const chartRef = useRef<ViewShot>(null);
  const { colors } = useTheme();
  const { t } = useTranslation();
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
      legend: [t('income'), t('expense')],
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

    const totalIncome = Object.values(incomeMap).reduce((a, b) => a + b, 0);
    const totalExpense = Object.values(expenseMap).reduce((a, b) => a + b, 0);

    return {
      incomePieData: Object.keys(incomeMap).map(key => {
        const percent = totalIncome ? (incomeMap[key] / totalIncome) * 100 : 0;
        return {
          name: `${t(key.toLowerCase())} (${percent.toFixed(1)}%)`,
          population: incomeMap[key],
          color: incomeColor[key] || '#ccc',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        };
      }),
      expensePieData: Object.keys(expenseMap).map(key => {
        const percent = totalExpense
          ? (expenseMap[key] / totalExpense) * 100
          : 0;
        return {
          name: `${t(key.toLowerCase())} (${percent.toFixed(1)}%)`,
          population: expenseMap[key],
          color: expenseColor[key] || '#ccc',
          legendFontColor: '#7F7F7F',
          legendFontSize: 12,
        };
      }),
    };
  }, [filtered, t]);
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
    try {
      const csv = Papa.unparse(
        filtered.map(t => ({
          Date: t.date,
          Category: t.category?.name || '',
          Type: t.category?.status || '',
          Amount: t.amount,
        })),
      );

      const path = `${RNFS.CachesDirectoryPath}/transactions.csv`;
      await RNFS.writeFile(path, csv, 'utf8');

      await Share.open({
        title: 'Transactions CSV',
        url: `file://${path}`,
        type: 'text/csv',
        failOnCancel: false,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <Rectangle style={styles.rectangleBackground} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('statistics-report')}</Text>
      </View>
      <View
        style={[
          styles.contentContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <View style={styles.switchContainer}>
          <View style={[styles.pickerContainer]}>
            <Picker
              selectedValue={chartType}
              style={styles.picker}
              onValueChange={itemValue => setChartType(itemValue)}
              dropdownIconColor="#429690"
            >
              <Picker.Item label={t('monthly-expenses')} value="bar" />
              <Picker.Item label={t('income-vs-expense-trend')} value="line" />
              <Picker.Item label={t('categories-breakdown')} value="pie" />
            </Picker>
          </View>
          <TouchableOpacity style={styles.sortButton} onPress={cyclePeriod}>
            <Text style={styles.sortText}>
              {period === 'month'
                ? t('time-this-month')
                : period === '3months'
                ? t('time-last-3-months')
                : t('time-this-year')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Export buttons */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <TouchableOpacity onPress={shareChart} style={styles.exportButton}>
            <Text style={styles.exportButtonText}>{t('share-graph')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={exportCSV} style={styles.exportButton}>
            <Text style={styles.exportButtonText}>{t('export-csv')}</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ minHeight: windowHeight - 140 }}>
          <ViewShot ref={chartRef} options={{ format: 'png', quality: 0.9 }}>
            {chartType === 'bar' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>
                  {t('monthly-expenses-bar-chart')}
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <BarChart
                    data={barData}
                    width={Math.max(
                      screenWidth - 40,
                      barData.labels.length * 60,
                    )}
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
                  {t('income-vs-expense-trend-line-chart')}
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
                  <Text style={styles.cardTitle}>
                    {t('income-by-category')}
                  </Text>
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
                  <Text style={styles.cardTitle}>
                    {t('expense-by-category')}
                  </Text>
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
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default StatisticsScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  rectangleBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  headerContainer: {
    flexDirection: 'row',
    top: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
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
  },
  sortButton: {
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFD54F',
    borderRadius: 20,
    width: 160,
    justifyContent: 'center',
  },
  sortText: { fontWeight: 'bold', color: '#333', alignSelf: 'center' },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    top: 150,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  pickerContainer: {
    flex: 1,
    maxWidth: 200,
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 20,
    marginRight: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: { height: 52, width: '100%', color: '#333' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
    elevation: 10,
  },
  cardTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  chart: { borderRadius: 12 },
  exportButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    width: 125,
  },
  exportButtonText: { color: '#fff', fontWeight: '600', alignSelf: 'center' },
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

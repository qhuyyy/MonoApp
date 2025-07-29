import { StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import React from 'react';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigations/SettingStack';
import { useTransactionStore } from '../../stores/useTransactionStore';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { pick } from '@react-native-documents/picker';

type Props = NativeStackScreenProps<SettingsStackParamList, 'DataManagement'>;

const DataManagementScreen = ({ navigation }: Props) => {
  const { exportJson, importJson, clearAll } = useTransactionStore();

  const handleExport = async () => {
    try {
      // Lấy toàn bộ dữ liệu giao dịch từ store
      const { transactions } = useTransactionStore.getState();

      // Chuyển thành JSON string (pretty format)
      const jsonData = JSON.stringify(transactions, null, 2);

      // Đường dẫn file JSON (lưu tạm trong Cache)
      const path = `${RNFS.CachesDirectoryPath}/transactions.json`;
      await RNFS.writeFile(path, jsonData, 'utf8');

      // Share file JSON
      await Share.open({
        title: 'Transactions JSON',
        url: `file://${path}`,
        type: 'application/json',
        failOnCancel: false,
      });
    } catch (error) {
      console.error('Export JSON error:', error);
      Alert.alert('Lỗi', 'Không thể xuất dữ liệu JSON');
    }
  };

  const handleImport = async () => {
    try {
      // Chọn file JSON
      const [result] = await pick({ type: ['application/json'] });
      if (!result) return;

      const fileUri = result.uri;

      // Đọc file JSON
      const content = await RNFS.readFile(fileUri, 'utf8');
      const transactions = JSON.parse(content);

      if (!Array.isArray(transactions)) {
        Alert.alert('Lỗi', 'Dữ liệu trong file không đúng định dạng');
        return;
      }
      await importJson(JSON.stringify(transactions));

      Alert.alert('Thành công', 'Đã nhập dữ liệu từ file JSON');
    } catch (error) {
      console.error('Import JSON error:', error);
      Alert.alert('Lỗi', 'Không thể nhập dữ liệu JSON');
    }
  };

  const handleClear = () => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa toàn bộ dữ liệu?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await clearAll();
          Alert.alert('Thành công', 'Đã xóa toàn bộ dữ liệu');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Data Management</Text>
      </View>

      <View style={styles.body}>
        <TouchableOpacity style={styles.button} onPress={handleExport}>
          <Text style={styles.buttonText}>Xuất dữ liệu (JSON)</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleImport}>
          <Text style={styles.buttonText}>Nhập dữ liệu từ file</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleClear}
        >
          <Text style={styles.buttonText}>Xóa toàn bộ dữ liệu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DataManagementScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 0, height: 50 },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: 10,
    position: 'relative',
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  backIcon: { position: 'absolute', left: 20 },
  body: { flex: 1, padding: 20 },
  button: {
    backgroundColor: '#2A7C76',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  deleteButton: { backgroundColor: '#d9534f' },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center' },
});

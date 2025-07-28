import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigations/SettingStack';

type Props = NativeStackScreenProps<SettingsStackParamList, 'DataManagement'>;

const DataManagementScreen = ({ navigation }: Props) => {
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
    </View>
  );
};

export default DataManagementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 0,
    height: 50,
  },
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
  backIcon: {
    position: 'absolute',
    left: 20,
  },
});

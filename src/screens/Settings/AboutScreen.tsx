import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  ScrollView,
} from 'react-native';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigations/SettingsStack';
import { useTranslation } from 'react-i18next';

type Props = NativeStackScreenProps<SettingsStackParamList, 'About'>;

const APP_VERSION = '1.0.0';
const DEV_NAME = 'Bùi Quang Huy';
const DEV_EMAIL = 'bqhuy221@gmail.com';
const DEV_WEBSITE = 'https://github.com/qhuyyy';

const AboutScreen = ({ navigation }: Props) => {
  const { t } = useTranslation();
  const openWebsite = () => Linking.openURL(DEV_WEBSITE);
  const openEmail = () => Linking.openURL(`mailto:${DEV_EMAIL}`);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Rectangle style={StyleSheet.absoluteFillObject} />
      </View>

      <View style={styles.titleContainer}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() =>
            navigation
              .getParent()
              ?.navigate('SettingsStack', { screen: 'Settings' })
          }
        >
          <Ionicons name="chevron-back-outline" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>{t('about-title')}</Text>
      </View>

      <ScrollView style={styles.settingContainer}>
        <Text style={styles.label}>{t('app-version')}</Text>
        <Text style={styles.value}>{APP_VERSION}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>{t('developer')}</Text>
        <Text style={styles.value}>{DEV_NAME}</Text>

        <Text style={[styles.label, { marginTop: 20 }]}>{t('contact')}</Text>
        <Text style={[styles.link]} onPress={openEmail}>
          {DEV_EMAIL}
        </Text>
        <Text style={[styles.link]} onPress={openWebsite}>
          {DEV_WEBSITE}
        </Text>

        <Text style={[styles.label, { marginTop: 30 }]}>{t('about-app')}</Text>
        <Text style={styles.description}>{t('about-description')}</Text>

        <Text style={[styles.label, { marginTop: 30 }]}>
          {t('key-features')}
        </Text>
        <Text style={styles.feature}>• {t('feature-track')}</Text>
        <Text style={styles.feature}>• {t('feature-categorize')}</Text>
        <Text style={styles.feature}>• {t('feature-report')}</Text>
        <Text style={styles.feature}>• {t('feature-export')}</Text>
        <Text style={styles.feature}>• {t('feature-multi-lang')}</Text>
      </ScrollView>
    </View>
  );
};

export default AboutScreen;

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
  title: { color: 'white', fontSize: 26, fontWeight: 'bold', alignSelf: 'center' },
  backIcon: { position: 'absolute', left: 20 },
  settingContainer: {
    flex: 1,
    marginHorizontal: 20,
    borderWidth: 1,
    backgroundColor: '#f2f2f2',
    elevation: 10,
    padding: 20,
    marginBottom: 10,
    borderRadius: 10,
  },
  label: { fontSize: 18, fontWeight: 'bold', color: '#429690' },
  value: { fontSize: 16, color: '#333', marginTop: 5 },
  link: { fontSize: 16, color: '#2A7C76', marginTop: 5, textDecorationLine: 'underline' },
  description: { fontSize: 16, color: '#333', marginTop: 5, lineHeight: 22 },
  feature: { fontSize: 15, color: '#555', marginTop: 8 },
});

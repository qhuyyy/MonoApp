import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { windowWidth } from '../../utils/Dimensions';
import FormInput from '../../components/FormInput';
import { useUserStore } from '../../stores/useUserStore';
import ButtonCustom from '../../components/ButtonCustom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { WelcomeStackParamList } from '../../navigations/WelcomeStack';
import { useTranslation } from 'react-i18next';
import { UserSchema } from '../../validation/UserSchema';

type Props = NativeStackScreenProps<WelcomeStackParamList, 'GetStarted'>;

const GetStartedScreen = ({ navigation }: Props) => {
  const {
    fullName,
    email,
    currency,
    avatar,
    setFullName,
    setEmail,
    setCurrency,
    setAvatar,
  } = useUserStore();

  const { t } = useTranslation();

  const pickImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      response => {
        if (
          !response.didCancel &&
          response.assets &&
          response.assets.length > 0
        ) {
          const uri = response.assets[0].uri;
          if (uri) setAvatar(uri);
        }
      },
    );
  };

  const handleGoHome = async () => {
    try {
      const user = { fullName, email, currency, avatar };
      await UserSchema.validate(user, { abortEarly: false });

      // Nếu validate thành công -> điều hướng
      navigation.getParent()?.navigate('MainBottomTabs');
    } catch (err: any) {
      if (err.inner) {
        const messages = err.inner.map((e: any) => e.message).join('\n');
        Alert.alert('Validation Error', messages);
      } else {
        Alert.alert('Error', err.message);
      }
    }
  };

  return (
    <LinearGradient
      colors={['#429690', '#2A7C76']}
      style={styles.linearGradient}
    >
      <Text style={styles.title}>{t('lets-get-started')}</Text>
      <Text style={styles.subTitle}>{t('we-need-your-information')}</Text>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>{t('avatar')}</Text>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{t('pick-avatar')}</Text>
            </View>
          )}
        </TouchableOpacity>

        <FormInput
          title={t('full-name')}
          placeholder={t('enter-full-name')}
          value={fullName}
          onChangeText={setFullName}
        />

        <FormInput
          title={t('email')}
          placeholder={t('enter-email')}
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>{t('preferred-currency')}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currency}
            onValueChange={setCurrency}
            style={styles.picker}
          >
            <Picker.Item label={t('vnd-vietnamese-dong')} value="VND" />
            <Picker.Item label={t('usd-us-dollar')} value="USD" />
            <Picker.Item label={t('eur-euro')} value="EUR" />
            <Picker.Item label={t('jpy-japanese-yen')} value="JPY" />
          </Picker>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <ButtonCustom text={t('go-to-home-screen')} onPress={handleGoHome} />
      </View>
    </LinearGradient>
  );
};

export default GetStartedScreen;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 10,
  },
  subTitle: {
    color: 'white',
    fontStyle: 'italic',
    fontSize: 16,
    marginBottom: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    width: windowWidth - 55,
    aspectRatio: 3 / 4,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'center',
  },
  inputLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#429690',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#429690',
    borderRadius: 8,
    marginTop: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 12,
  },
});

import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { windowWidth } from '../../utils/Dimensions';
import FormInput from '../../components/FormInput';
import { useUserStore } from '../../stores/useUserStore';
import ButtonCustom from '../../components/ButtonCustom';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigations/RootStack';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

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

  return (
    <LinearGradient
      colors={['#429690', '#2A7C76']}
      style={styles.linearGradient}
    >
      <Text style={styles.title}>Let's Get Started!</Text>
      <Text style={styles.subTitle}>
        We gonna need some of your information first
      </Text>

      <View style={styles.formContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>Pick Avatar</Text>
            </View>
          )}
        </TouchableOpacity>

        <FormInput
          title="Full Name:"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <FormInput
          title="Email:"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.inputLabel}>Preferred Currency:</Text>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={currency}
            onValueChange={setCurrency}
            style={styles.picker}
          >
            <Picker.Item label="VND - Vietnamese Dong" value="VND" />
            <Picker.Item label="USD - US Dollar" value="USD" />
            <Picker.Item label="EUR - Euro" value="EUR" />
            <Picker.Item label="JPY - Japanese Yen" value="JPY" />
          </Picker>
        </View>
      </View>

      <View style={{ marginTop: 20 }}>
        <ButtonCustom
          text="Go to Home Screen"
          onPress={() => navigation.navigate('Home')}
        />
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

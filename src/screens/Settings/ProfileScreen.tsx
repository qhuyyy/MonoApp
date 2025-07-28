import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { windowWidth } from '../../utils/Dimensions';
import FormInput from '../../components/FormInput';
import { useUserStore } from '../../stores/useUserStore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SettingsStackParamList } from '../../navigations/SettingStack';
import Rectangle from '../../assets/svg/Rectangle';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ButtonCustom from '../../components/ButtonCustom';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Profile'>;

const ProfileScreen = ({ navigation }: Props) => {
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
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.inputLabel}>Avatar:</Text>
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

        <View style={{ marginTop: 20 }}>
          <ButtonCustom text="OK" onPress={() => navigation.goBack()} />
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F7F7',
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
  formContainer: {
    alignSelf: 'center',
    backgroundColor: 'white',
    width: windowWidth - 55,
    borderRadius: 30,
    padding: 20,
    justifyContent: 'center',
    elevation: 10,
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
  backIcon: {
    position: 'absolute',
    left: 20,
  },
});

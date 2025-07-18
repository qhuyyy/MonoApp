import { StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';

type FormInputProps = {
  title: string;
  placeholder: string | null;
};

const FormInput = ({ title, placeholder }: FormInputProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder ?? ''}
        placeholderTextColor="#999"
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 6,
    fontSize: 14,
    color: '#429690',
  },
  input: {
    borderWidth: 1,
    borderColor: '#429690',
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
});

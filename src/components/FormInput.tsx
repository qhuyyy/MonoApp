import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TextInputProps,
} from 'react-native';
import React from 'react';

type FormInputProps = {
  title: string;
  error?: string | false;
} & TextInputProps;

const FormInput = ({ title, error, ...rest }: FormInputProps) => {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{title}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#999"
        {...rest}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#429690',
    height: 55,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  inputError: {
    borderColor: '#ff4d4f',
  },
  errorText: {
    color: '#ff4d4f',
    marginTop: 4,
    fontSize: 12,
  },
});

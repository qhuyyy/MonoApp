import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

type OutlineButtonCustomProps = {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
};

const OutlineButtonCustom = ({ text, ...rest }: OutlineButtonCustomProps) => {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default OutlineButtonCustom;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#438883',
    borderRadius: 30,
  },
  text: {
    color: '#438883',
    fontSize: 18,
    fontWeight: '600',
  },
});

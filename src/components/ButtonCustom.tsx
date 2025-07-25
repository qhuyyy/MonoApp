import {
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

type ButtonCustomProps = {
  text: string;
  onPress?: () => void;
  disabled?: boolean;
};

const ButtonCustom = ({ text, ...rest }: ButtonCustomProps) => {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#438883',
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
    paddingHorizontal: 10
  },
  text: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

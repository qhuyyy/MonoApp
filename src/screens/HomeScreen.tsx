import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.welcome}>Good afternoon,</Text>
        <Text style={styles.name}>Enjelin Morgeana</Text>
      </View>

      {/* Bottom Curve */}
      <Svg
        height="80"
        width={width}
        viewBox="0 0 1440 320"
        style={styles.curve}
        preserveAspectRatio="none"
      >
        <Path
          fill="#438883"
          d="M0,0 C360,80 1080,-80 1440,0 L1440,320 L0,320 Z"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#438883',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 0,
    position: 'relative',
  },
  header: {
    zIndex: 1,
    paddingBottom: 40,
  },
  welcome: {
    color: 'white',
    fontSize: 16,
  },
  name: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  curve: {
    position: 'absolute',
    bottom: -1,
    left: 0,
  },
});

export default HomeScreen;

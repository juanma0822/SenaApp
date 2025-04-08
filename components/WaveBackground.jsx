// components/WaveBackground.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function WaveBackground() {
  return (
    <View style={styles.waveContainer}>
      <Svg
        height="100%"
        width="100%"
        viewBox="0 0 1415 301"
        style={styles.wave}
      >
        <Path
          fill="#00AF00"
          d="M0,96L48,106.7C96,117,192,139,288,154.7C384,171,480,181,576,186.7C672,192,768,192,864,186.7C960,181,1056,171,1152,160C1248,149,1344,139,1392,133.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '11%',
    zIndex: 10,
  },
  wave: {
    width: '100%',
  },
});

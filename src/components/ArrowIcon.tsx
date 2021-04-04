import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

export default function ArrowIcon() {
  return (
    <Image
      resizeMode="contain"
      style={styles.arrowRight}
      source={require('../assets/qietu/shoufeimingxi/charge_details_icon_open_normal.png')}
    />
  );
}

const styles = StyleSheet.create({
  arrowRight: {
    width: scaleSize(10),
    height: scaleSize(20),
    marginVertical: scaleSize(8),
  },
});

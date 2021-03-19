import * as React from 'react';
import { StyleSheet, Image } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

export default function ArrowIcon() {
  return (
    <Image
      style={styles.arrowRight}
      source={require('../assets/qietu/shoufeimingxi/charge_details_icon_open_normal.png')}
    />
  );
}

const styles = StyleSheet.create({
  arrowRight: {
    width: scaleSize(28),
    height: scaleSize(36),
    marginVertical: scaleSize(8),
  },
});

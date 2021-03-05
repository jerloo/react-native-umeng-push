import * as React from 'react';
import { Image, StyleSheet } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

export default function LocationButton() {
  return (
    <Image
      style={styles.iconLocation}
      source={require('../assets/qietu/cebenxiangqing/book_details_icon_address_normal.png')}
    />
  );
}

const styles = StyleSheet.create({
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
    marginTop: scaleSize(5),
  },
});

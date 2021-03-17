import * as React from 'react';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props {
  address: string;
}

export default function LocationButton(props: Props) {
  return (
    <TouchableOpacity
      onPress={() => {
        try {
          // mapUtils.open({ dname: props.address });
        } catch (e) {
          console.log(e);
        }
      }}>
      <Image
        style={styles.iconLocation}
        source={require('../assets/qietu/cebenxiangqing/book_details_icon_address_normal.png')}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
    marginTop: scaleSize(5),
  },
});

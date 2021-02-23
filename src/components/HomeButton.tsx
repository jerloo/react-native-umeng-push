import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ImageSource } from 'react-native-vector-icons/Icon';
import {
  scaleSize,
  scaleHeight,
  setSpText2,
} from 'react-native-responsive-design';
import { TouchableNativeFeedback } from 'react-native-gesture-handler';

type Props = {
  colorLeft: string;
  colorTop: string;
  iconSource: ImageSource;
  title: string;
  onPress: () => void;
};
export default function HomeButton(props: Props) {
  return (
    <TouchableNativeFeedback
      style={styles.homeButtonContainer}
      onPress={props.onPress}>
      <Image style={styles.homeButtonIcon} source={props.iconSource} />
      <Text style={styles.homeButtonTitle}>{props.title}</Text>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  homeButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F5F6FA',
    width: scaleSize(220),
    height: scaleSize(220),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(8),
  },
  homeButtonIcon: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  homeButtonTitle: {
    fontSize: setSpText2(34),
    marginTop: scaleHeight(22),
    color: '#666666',
  },
});

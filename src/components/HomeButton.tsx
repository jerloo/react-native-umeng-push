import * as React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ImageSource } from 'react-native-vector-icons/Icon';
import {
  scaleSize,
  scaleHeight,
  setSpText2,
} from 'react-native-responsive-design';

type Props = {
  colorLeft: string;
  colorTop: string;
  iconSource: ImageSource;
  title: string;
};
export default function HomeButton(props: Props) {
  return (
    <View style={styles.homeButtonContainer}>
      <View
        style={[styles.homeButtonTop, { backgroundColor: props.colorTop }]}
      />
      <View style={[styles.homeButton, { borderLeftColor: props.colorLeft }]}>
        <Image style={styles.homeButtonIcon} source={props.iconSource} />
        <Text style={styles.homeButtonTitle}>{props.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  homeButtonContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  homeButtonTop: {
    width: scaleSize(330),
    height: scaleHeight(10),
    marginBottom: -scaleHeight(5),
    backgroundColor: '#BED5F5',
    borderTopEndRadius: 5,
    borderLeftWidth: 0,
    transform: [{ rotate: '359deg' }],
  },
  homeButton: {
    width: scaleSize(330),
    height: scaleHeight(220),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderLeftColor: '#096BF3',
    borderLeftWidth: 5,
    backgroundColor: '#FFFEFC',
    borderBottomEndRadius: 5,
    borderTopEndRadius: 5,
  },
  homeButtonIcon: {
    width: scaleSize(80),
    height: scaleSize(80),
  },
  homeButtonTitle: {
    fontSize: setSpText2(34),
    marginTop: scaleHeight(22),
    fontWeight: 'bold',
  },
});

import * as React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  View,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  scaleSize,
  scaleHeight,
  setSpText2,
} from 'react-native-responsive-design';

type Props = {
  colorLeft: string;
  colorTop: string;
  iconSource: ImageSourcePropType;
  title: string;
  onPress?: () => void;
};

export default function HomeButton(props: Props) {
  return (
    <TouchableOpacity onPress={() => props.onPress && props.onPress()}>
      <View style={styles.homeButtonContainer}>
        <Image style={styles.homeButtonIcon} source={props.iconSource} />
        <Text style={styles.homeButtonTitle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
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

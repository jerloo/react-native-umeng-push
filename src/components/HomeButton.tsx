import * as React from 'react';
import {
  Text,
  StyleSheet,
  Image,
  ImageSourcePropType,
  View,
  TouchableOpacity,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

type Props = {
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
    fontSize: scaleSize(34),
    marginTop: scaleSize(22),
    color: '#666666',
  },
});

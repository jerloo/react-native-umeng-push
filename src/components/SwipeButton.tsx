import * as React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  icon: ImageSourcePropType;
  title: string;
  style?: StyleProp<ViewStyle>;
  onClick: () => void;
}

export default function SwipeButton({ icon, title, style, onClick }: Props) {
  return (
    <TouchableOpacity style={[styles.rowHiddenButton, style]} onPress={onClick}>
      <Image style={styles.rowHiddenIcon} source={icon} />
      <Text style={styles.rowHiddenText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowHiddenIcon: {
    width: scaleSize(40),
    height: scaleSize(40),
    marginTop: scaleSize(12),
  },
  rowHiddenButton: {
    width: scaleSize(120),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  rowHiddenText: {
    color: colorWhite,
    fontSize: scaleSize(24),
  },
});

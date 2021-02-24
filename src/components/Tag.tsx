import * as React from 'react';
import { StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props {
  title: string;
  textColor?: string;
  borderColor?: string;
  style?: StyleProp<ViewStyle>;
}

export default function Tag({ title, textColor, borderColor, style }: Props) {
  return (
    <Text
      style={[
        styles.default,
        style,
        {
          color: textColor && textColor,
          borderColor: borderColor && borderColor,
        },
      ]}>
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  default: {
    borderWidth: scaleSize(2),
    borderColor: 'blue',
    borderRadius: scaleSize(23),
    height: scaleSize(36),
    color: '#EAAF38',
    fontSize: scaleSize(22),
    paddingVertical: scaleSize(3),
    paddingHorizontal: scaleSize(23),
  },
});

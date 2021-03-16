import * as React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props extends TextInputProps {
  fontColor?: string;
  fontSize?: number;
}

export default function PureInput(props: Props) {
  return (
    <TextInput
      {...props}
      style={[
        styles.default,
        props.style,
        {
          fontSize: props.fontSize && props.fontSize,
          color: props.fontColor && props.fontColor,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    flex: 1,
    margin: 0,
    padding: 0,
    fontSize: scaleSize(32),
    color: '#999999',
  },
});

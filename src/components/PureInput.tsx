import * as React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface Props extends TextInputProps {}

export default function PureInput(props: TextInputProps) {
  return <TextInput {...props} />;
}

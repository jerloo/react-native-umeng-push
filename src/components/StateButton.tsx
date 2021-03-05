import * as React from 'react';
import { StyleSheet, Text } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  selected?: boolean;
  title?: string;
}

export default function StateButton({ selected, title }: Props) {
  const style = selected ? [styles.basic, styles.active] : [styles.basic];
  return <Text style={style}>{title}</Text>;
}

const styles = StyleSheet.create({
  basic: {
    fontSize: scaleSize(28),
    backgroundColor: '#F7F7F7',
    color: '#666666',
  },
  active: {
    backgroundColor: '#4B90F2',
    color: colorWhite,
  },
});

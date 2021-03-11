import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  selected?: boolean;
  title?: string;
  onClick?: () => void;
}

export default function StateButton({ selected, title, onClick }: Props) {
  const style = selected ? [styles.basic, styles.active] : [styles.basic];
  return (
    <TouchableOpacity onPress={onClick}>
      <Text style={style}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  basic: {
    fontSize: scaleSize(28),
    backgroundColor: '#F7F7F7',
    color: '#666666',
    paddingVertical: scaleSize(4),
    paddingHorizontal: scaleSize(22),
    borderRadius: scaleSize(5),
    marginEnd: scaleSize(16),
  },
  active: {
    backgroundColor: '#4B90F2',
    color: colorWhite,
  },
});

import * as React from 'react';
import { Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  selected?: boolean;
  title?: string;
  onClick?: () => void;
  icon: 'add' | 'remove' | 'none';
}

export default function StateButtonEx({
  selected,
  title,
  onClick,
  icon,
}: Props) {
  const style = selected ? [styles.basic, styles.active] : [styles.basic];
  const _onClick = () => {
    console.log('_onClick');
    onClick && onClick();
  };
  return (
    <TouchableOpacity onPress={_onClick}>
      <View style={{ paddingTop: scaleSize(10), paddingRight: scaleSize(10) }}>
        <Text style={style}>{title}</Text>
        {icon !== 'none' ? (
          <Image
            style={styles.icon}
            source={
              icon === 'add'
                ? require('../assets/qietu/chaobiaoluru/enter_icon_add_normal.png')
                : require('../assets/qietu/chaobiaoluru/enter_icon_remove_normal.png')
            }
          />
        ) : (
          <View style={styles.icon} />
        )}
      </View>
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
  },
  active: {
    backgroundColor: '#4B90F2',
    color: colorWhite,
  },
  icon: {
    width: scaleSize(20),
    height: scaleSize(20),
    position: 'absolute',
    right: scaleSize(5),
    // top: scaleSize(-10),
  },
});

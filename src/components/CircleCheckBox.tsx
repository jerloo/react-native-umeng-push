import * as React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props {
  checked: boolean;
  onClick?: () => void;
  title?: string;
}

export default function CircleCheckBox(props: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onClick}>
      {props.checked ? (
        <View style={[styles.rememberIconContainer]}>
          <Image
            style={styles.rememberIcon}
            source={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_unselectde_slelected.png')}
          />
        </View>
      ) : (
        <View style={[styles.rememberIconContainer]}>
          <Image
            style={styles.rememberIcon}
            source={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_unselectde_normal.png')}
          />
        </View>
      )}
      {props.title ? <Text style={styles.title}>{props.title}</Text> : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberIcon: {
    width: scaleSize(28),
    height: scaleSize(28),
  },
  rememberIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingEnd: scaleSize(18),
    paddingStart: scaleSize(34),
    paddingTop: scaleSize(16),
  },
  title: {
    fontSize: scaleSize(32),
    color: '#666666',
  },
});

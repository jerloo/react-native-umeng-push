import * as React from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Text } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props {
  checked: boolean;
  onClick: () => void;
  title?: string;
}

export default function CircleCheckBox(props: Props) {
  return (
    <TouchableOpacity style={styles.container} onPress={props.onClick}>
      {props.checked ? (
        <View style={[styles.inputIcon, styles.rememberIconContainer]}>
          <Image
            style={styles.rememberIcon}
            source={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_unselectde_slelected.png')}
          />
        </View>
      ) : (
        <View style={[styles.inputIcon, styles.rememberIconContainer]}>
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
  rememberContainer: {
    padding: 0,
    borderWidth: 0,
    marginHorizontal: 0,
    width: '100%',
    marginStart: 0,
    backgroundColor: 'transparent',
    // backgroundColor: 'blue',
    margin: 0,
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
  },
  inputIcon: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
  geyuechao: {
    color: '#EA9538',
    fontSize: scaleSize(18),
    borderRadius: scaleSize(6),
    borderWidth: scaleSize(2),
    borderColor: '#EA9538',
    paddingVertical: scaleSize(2),
    paddingHorizontal: scaleSize(8),
    marginStart: scaleSize(18),
    textAlign: 'center',
  },
  downloaded: {
    color: '#3874EA',
    fontSize: scaleSize(18),
    borderRadius: scaleSize(6),
    borderWidth: scaleSize(2),
    borderColor: '#3874EA',
    paddingVertical: scaleSize(2),
    paddingHorizontal: scaleSize(8),
    marginStart: scaleSize(12),
    textAlign: 'center',
  },
  title: {
    fontSize: scaleSize(32),
    color: '#666666',
    marginStart: scaleSize(16),
  },
});

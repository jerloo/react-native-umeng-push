import * as React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  ImageSourcePropType,
  ImageStyle,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props {
  checked: boolean;
  onClick?: () => void;
  title?: string;
  iconNormal?: ImageSourcePropType;
  iconSelected?: ImageSourcePropType;
  iconStyle?: ImageStyle;
  disabled?: boolean;
}

export default function CircleCheckBox(props: Props) {
  const imgStyle = props.iconStyle ? props.iconStyle : styles.rememberIcon;
  return (
    <TouchableOpacity
      activeOpacity={props.disabled ? 1 : 0.2}
      style={styles.container}
      onPress={() => !props.disabled && props.onClick && props?.onClick()}>
      {props.checked ? (
        <View style={[styles.rememberIconContainer]}>
          <Image
            style={imgStyle}
            source={
              props.iconSelected ||
              require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_unselectde_slelected.png')
            }
          />
        </View>
      ) : (
        <View style={[styles.rememberIconContainer]}>
          <Image
            style={imgStyle}
            source={
              props.iconNormal ||
              require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_unselectde_normal.png')
            }
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
    // width: scaleSize(28),
    // height: scaleSize(28),
  },
  rememberIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: scaleSize(30),
    // backgroundColor: 'blue',
  },
  title: {
    fontSize: scaleSize(32),
    color: '#666666',
  },
});

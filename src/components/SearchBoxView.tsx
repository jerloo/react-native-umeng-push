import React from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Image,
  ImageSourcePropType,
  Text,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';

interface Props {
  style?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  placeholderTextColor?: string;
  placeholder?: string;
  icon?: ImageSourcePropType;
}

export default function SearchBoxView(props: Props) {
  return (
    <View style={[styles.searchBoxContainer, props.style]}>
      <View style={{ marginStart: scaleSize(22), marginEnd: scaleSize(18) }}>
        <Image
          style={styles.icon}
          source={
            props.icon ||
            require('../assets/qietu/shouye/homepage_icon_input-normal.png')
          }
        />
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.input}>
          <Text style={{ color: props.placeholderTextColor || '#BFC9E3' }}>
            {props.placeholder || '户号/户名/地址/册本号'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBoxContainer: {
    backgroundColor: '#F2F3F5',
    borderRadius: scaleSize(30),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: scaleSize(60),
  },
  input: {
    fontSize: scaleSize(28),
    height: '100%',
    padding: 0,
    color: '#BFC9E3',
    justifyContent: 'center',
  },
  inputContainer: {
    flex: 1,
    marginEnd: scaleSize(30),
  },
  icon: {
    width: scaleSize(32),
    height: scaleSize(32),
  },
});

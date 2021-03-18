import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  Text,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  style?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<ViewStyle>;
  placeholderTextColor?: string;
  placeholder?: string;
  icon?: ImageSourcePropType;
  onDone: () => void;
  onChangeText: (text: string) => void;
}

export default function SearchPageBox(props: Props) {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={[styles.searchBoxContainer, props.style]}>
        <View style={{ marginStart: scaleSize(22), marginEnd: scaleSize(18) }}>
          <Image
            style={styles.icon}
            source={
              props.icon ||
              require('../assets/qietu/cebenxiangqing/book_details_icon_query_normal.png')
            }
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            enablesReturnKeyAutomatically
            style={styles.input}
            underlineColorAndroid="transparent"
            placeholder={props.placeholder || '户号/户名/地址/册本号'}
            placeholderTextColor={props.placeholderTextColor || '#BFC9E3'}
            onSubmitEditing={props.onDone}
            onChangeText={props.onChangeText}
          />
        </View>
      </View>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.cancelButtonText}>取消</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: scaleSize(30),
    paddingStart: scaleSize(30),
  },
  searchBoxContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: scaleSize(30),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    height: scaleSize(60),
    flex: 1,
  },
  input: {
    fontSize: scaleSize(28),
    height: '100%',
    padding: 0,
    color: '#BFC9E3',
  },
  inputContainer: {
    flex: 1,
    marginEnd: scaleSize(30),
  },
  icon: {
    width: scaleSize(32),
    height: scaleSize(32),
  },
  cancelButton: {
    paddingEnd: scaleSize(30),
    paddingStart: scaleSize(14),
    paddingVertical: scaleSize(10),
  },
  cancelButtonText: {
    fontSize: scaleSize(28),
    color: colorWhite,
  },
});

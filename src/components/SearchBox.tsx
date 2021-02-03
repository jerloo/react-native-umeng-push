import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {colorWhite} from '../styles';
import {Icon} from 'react-native-elements';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';

export default function SearchBox() {
  return (
    <View style={styles.searchBoxContainer}>
      <View style={{marginStart: scaleSize(22), marginEnd: scaleSize(18)}}>
        <Icon name="search" color="#FFFFFF" />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          underlineColorAndroid="transparent"
          placeholder="户号/户名/地址/册本号"
          placeholderTextColor={colorWhite}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBoxContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: scaleHeight(40),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: scaleSize(10),
    height: scaleHeight(60),
  },
  input: {
    fontSize: setSpText2(28),
    height: '100%',
    padding: 0,
  },
  inputContainer: {
    flex: 1,
    marginEnd: scaleSize(30),
  },
});

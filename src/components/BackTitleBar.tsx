import React from 'react';
import { View, Image, Text, StyleSheet, StatusBar } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';

interface Props {
  onBack: () => void;
}
export function BackTitleBar(props: Props) {
  return (
    <View style={styles.titleBar}>
      <TouchableWithoutFeedback onPress={() => props.onBack()}>
        <Image
          style={styles.titleBarBackButton}
          source={require('../assets/btn_back.png')}
        />
      </TouchableWithoutFeedback>

      <Text style={styles.titleBarTitle}>个人信息</Text>
      <View style={styles.titleBarBackButton} />
    </View>
  );
}

const paddingScreen = scaleSize(30);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  titleBar: {
    backgroundColor: '#F5F5F5',
    paddingTop: (StatusBar.currentHeight || 0) + scaleHeight(20),
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: paddingScreen,
    paddingVertical: scaleHeight(20),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBarBackButton: {
    width: scaleSize(18),
    height: scaleHeight(32),
    // alignSelf: 'flex-start',
  },
  titleBarTitle: {
    fontSize: setSpText2(40),
    color: '#333333',
    // alignSelf: 'center',
  },
});

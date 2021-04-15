import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../../styles';
import { useNavigation } from '@react-navigation/core';

interface Props {
  onBack?: () => void;
  onRightClick?: () => void;
  rightIcon?: ImageSourcePropType;
  title?: string;
  titleColor?: string;
  leftIcon?: ImageSourcePropType;
}

export default function BooksBackTitleBar(props: Props) {
  const navigation = useNavigation();
  return (
    <View style={styles.titleBar}>
      <TouchableWithoutFeedback onPress={() => props.onBack && props.onBack()}>
        <Image
          style={styles.titleBarBackButton}
          source={
            props.leftIcon ||
            require('../../assets/qietu/cebenxiangqing/book_details_icon_back_normal.png')
          }
        />
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => navigation.navigate('Home')}>
        <Image
          style={styles.titleBarHomeButton}
          source={require('../../assets/home.png')}
        />
      </TouchableWithoutFeedback>

      <View style={styles.titleContainer}>
        <Text
          numberOfLines={1}
          ellipsizeMode="middle"
          style={[styles.titleBarTitle, { color: props.titleColor }]}>
          {props.title || '抄表任务'}
        </Text>
      </View>
      <TouchableWithoutFeedback
        onPress={() => props.onRightClick && props?.onRightClick()}>
        <Image
          style={styles.titleBarBackButton}
          source={
            props.rightIcon ||
            require('../../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')
          }
        />
      </TouchableWithoutFeedback>
    </View>
  );
}

const paddingScreen = scaleSize(30);

const styles = StyleSheet.create({
  titleBar: {
    backgroundColor: 'transparent',
    // paddingTop: (StatusBar.currentHeight || 0) + scaleHeight(20),
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: paddingScreen,
    paddingVertical: scaleSize(20),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBarBackButton: {
    width: scaleSize(32),
    height: scaleSize(32),
    // alignSelf: 'flex-start',
  },
  titleBarHomeButton: {
    width: scaleSize(32),
    height: scaleSize(32),
    marginLeft: scaleSize(30),
  },
  titleBarTitle: {
    fontSize: scaleSize(40),
    color: colorWhite,
    alignSelf: 'center',
  },
  titleContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

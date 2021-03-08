import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  ImageSourcePropType,
} from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import { colorWhite } from '../../styles';

interface Props {
  onBack?: () => void;
  onRight1Click?: () => void;
  onRight2Click?: () => void;
  title?: string;
  titleColor?: string;
  backIcon?: ImageSourcePropType;
  right1Icon?: ImageSourcePropType;
  right2Icon?: ImageSourcePropType;
}

export default function CommonTitleBarEx(props: Props) {
  return (
    <View style={styles.titleBar}>
      <View style={styles.rightContainer}>
        <TouchableWithoutFeedback
          style={styles.button}
          onPress={() => props.onBack && props.onBack()}>
          <Image
            style={styles.titleBarBackButton}
            source={
              props.backIcon ||
              require('../../assets/qietu/cebenxiangqing/book_details_icon_back_normal.png')
            }
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          style={styles.button}
          onPress={() => props.onBack && props.onBack()}>
          <View style={styles.titleBarBackButton} />
        </TouchableWithoutFeedback>
      </View>

      <Text
        style={[
          styles.titleBarTitle,
          { color: props.titleColor && props.titleColor },
        ]}>
        {props.title || '抄表任务'}
      </Text>
      <View style={styles.rightContainer}>
        {props.right1Icon ? (
          <TouchableWithoutFeedback
            style={styles.button}
            onPress={() => props.onRight1Click && props.onRight1Click()}>
            <Image
              style={styles.titleBarBackButton}
              source={
                props.right1Icon ||
                require('../../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')
              }
            />
          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.titleBarBackButton} />
        )}
        {props.right2Icon ? (
          <TouchableWithoutFeedback
            style={styles.button}
            onPress={() => props.onRight2Click && props.onRight2Click()}>
            <Image
              style={styles.titleBarBackButton}
              source={
                props.right2Icon ||
                require('../../assets/qietu/cebenxiangqing/book_details_icon_adjustment_normal.png')
              }
            />
          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.titleBarBackButton} />
        )}
      </View>
    </View>
  );
}

const paddingScreen = scaleSize(30);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  button: {
    padding: scaleSize(10),
  },
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
  titleBarTitle: {
    fontSize: setSpText2(40),
    color: colorWhite,
    // alignSelf: 'center',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});

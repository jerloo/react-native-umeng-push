import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import { colorWhite } from '../styles';

interface Props {
  onBack: () => void;
  onSortClick: () => void;
  title?: string;
}

export default function BookDataBackTitleBar(props: Props) {
  return (
    <View style={styles.titleBar}>
      <TouchableWithoutFeedback onPress={() => props.onBack()}>
        <Image
          style={styles.titleBarBackButton}
          source={require('../assets/qietu/cebenxiangqing/book_details_icon_back_normal.png')}
        />
      </TouchableWithoutFeedback>

      <Text style={styles.titleBarTitle}>{props.title || '抄表任务'}</Text>
      <View style={styles.rightContainer}>
        <TouchableWithoutFeedback
          style={{ marginEnd: scaleSize(18) }}
          onPress={() => props.onBack()}>
          <Image
            style={styles.titleBarBackButton}
            source={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
          />
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback onPress={() => props.onSortClick()}>
          <Image
            style={styles.titleBarBackButton}
            source={require('../assets/qietu/cebenxiangqing/book_details_icon_adjustment_normal.png')}
          />
        </TouchableWithoutFeedback>
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

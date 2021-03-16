import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';

interface Props {
  canDone: boolean;
  title: string;
  onBack: () => void;
  onDone: () => void;
}

export default function EditTitleBar(props: Props) {
  return (
    <View style={styles.titleBar}>
      <TouchableWithoutFeedback onPress={() => props.onBack()}>
        <Text style={styles.titleBarBackButton}>取消</Text>
      </TouchableWithoutFeedback>

      <Text
        numberOfLines={1}
        ellipsizeMode="middle"
        style={styles.titleBarTitle}>
        {props.title}
      </Text>
      <TouchableOpacity
        activeOpacity={props.canDone ? 0.2 : 1.0}
        onPress={() => props.canDone && props.onDone()}
        style={[
          styles.titleBarDoneButton,
          props.canDone && styles.titleBarDoneEnabledButton,
        ]}>
        <Text
          style={[
            styles.titleBarDoneButtonText,
            props.canDone && styles.titleBarDoneEnabledText,
          ]}>
          完成
        </Text>
      </TouchableOpacity>
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
    // height: scaleHeight(32),
    // alignSelf: 'flex-start',
    fontSize: setSpText2(30),
  },
  titleBarTitle: {
    fontSize: setSpText2(40),
    color: '#333333',
    flex: 1,
    // alignSelf: 'center',
  },
  titleBarDoneButton: {
    backgroundColor: '#E6E6E6',
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleHeight(3),
    borderRadius: scaleSize(4),
    fontSize: setSpText2(30),
  },
  titleBarDoneButtonText: {
    color: '#999999',
  },
  titleBarDoneEnabledButton: {
    backgroundColor: '#096BF3',
  },
  titleBarDoneEnabledText: {
    color: '#FFFFFF',
  },
});

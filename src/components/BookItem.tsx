import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import PdaMeterBookDtoHolder from '../data/bookHolder';
import { colorWhite } from '../styles';
import CircleCheckBox from './CircleCheckBox';

interface Props {
  holder: PdaMeterBookDtoHolder;
  onClick: () => void;
  onCheckClick: () => void;
}

export default function BookItem(props: Props) {
  return (
    <TouchableWithoutFeedback style={styles.container} onPress={props.onClick}>
      <View style={styles.titleContainer}>
        <CircleCheckBox
          checked={props.holder.checked}
          onClick={props.onCheckClick}
        />
        <Text style={styles.bookName}>{props.holder.item.bookName}</Text>
        <Text style={styles.geyuechao}>隔月抄</Text>
        {props.holder.downloaded ? (
          <Text style={styles.downloaded}>已下载</Text>
        ) : null}
      </View>
      <View style={styles.detailsContainer}>
        <View style={styles.detailsBox}>
          <Text style={styles.detailsLabel}>应抄：</Text>
          <Text style={styles.detailsValue}>
            {props.holder.item.totalNumber}
          </Text>
        </View>
        <View style={styles.detailsBox}>
          <Text style={styles.detailsLabel}>已抄：</Text>
          <Text style={styles.detailsValue}>
            {props.holder.item.readingNumber}
          </Text>
        </View>
        <View style={styles.detailsBox}>
          <Text style={styles.detailsLabel}>已上传：</Text>
          <Text style={styles.detailsValue}>
            {props.holder.item.readingNumber}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: scaleSize(34),
    paddingTop: scaleSize(16),
    paddingBottom: scaleSize(24),
    backgroundColor: colorWhite,
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookName: {
    color: '#333333',
    fontSize: setSpText2(34),
    marginStart: scaleSize(18),
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: scaleSize(30),
    justifyContent: 'space-between',
  },
  detailsLabel: {
    fontSize: setSpText2(30),
    color: '#999999',
  },
  detailsValue: {
    fontSize: setSpText2(30),
    color: '#333333',
  },
  detailsBox: {
    display: 'flex',
    flexDirection: 'row',
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
});

import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaMeterBookDtoHolder } from '../data/holders';
import { colorWhite } from '../styles';
import CircleCheckBox from './CircleCheckBox';

interface Props {
  holder: PdaMeterBookDtoHolder;
  onCheckClick: () => void;
}

export default function BookItem(props: Props) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <CircleCheckBox
        checked={props.holder.checked}
        onClick={props.onCheckClick}
        iconStyle={{
          width: scaleSize(38),
          height: scaleSize(38),
        }}
        iconContainerStyle={{
          height: scaleSize(150),
          width: scaleSize(100),
          justifyContent: 'center',
          alignItems: 'center',
        }}
        disabled={props.holder.downloaded}
      />
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.bookName}>{props.holder.bookName}</Text>
          <Text style={styles.geyuechao}>{props.holder.readCycle}</Text>

          {/* <Text style={styles.downloaded}>
            {props.holder.downloaded ? '已下载' : '未下载'}
          </Text> */}
        </View>
        <View style={styles.detailsContainer}>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsLabel}>应抄：</Text>
            <Text style={styles.detailsValue}>{props.holder.totalNumber}</Text>
          </View>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsLabel}>已抄：</Text>
            <Text style={styles.detailsValue}>
              {props.holder.readingNumber}
            </Text>
          </View>
          <View style={styles.detailsBox}>
            <Text style={styles.detailsLabel}>已上传：</Text>
            <Text style={styles.detailsValue}>
              {props.holder.uploadedNumber || 0}
            </Text>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            right: scaleSize(-48),
            top: scaleSize(-48),
            width: scaleSize(98),
            height: scaleSize(98),
            backgroundColor: props.holder.downloaded ? '#4B90F2' : '#F5F6FA',
            transform: [{ rotate: '45deg' }],
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            alignItems: 'center',
            paddingBottom: scaleSize(2),
          }}>
          <Text
            style={{
              fontSize: scaleSize(16),
              color: props.holder.downloaded ? colorWhite : '#999999',
            }}>
            {props.holder.downloaded ? '已下载' : '未下载'}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: scaleSize(34),
    // paddingTop: scaleSize(16),
    // paddingBottom: scaleSize(24),
    backgroundColor: colorWhite,
    height: scaleSize(150),
    justifyContent: 'space-around',
    borderRadius: scaleSize(10),
    overflow: 'hidden',
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'blue',
    paddingStart: scaleSize(18),
  },
  bookName: {
    color: '#333333',
    fontSize: scaleSize(34),
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(20),
    marginBottom: scaleSize(14),
    alignItems: 'center',
  },
  detailsLabel: {
    fontSize: scaleSize(30),
    color: '#999999',
  },
  detailsValue: {
    fontSize: scaleSize(30),
    color: '#333333',
  },
  detailsBox: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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

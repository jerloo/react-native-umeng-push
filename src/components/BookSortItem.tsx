import dayjs from 'dayjs';
import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadDataDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';

interface Props {
  item: PdaReadDataDto;
  showExtra: boolean;
}

export default function BookSortItem(props: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.sortIndex}>
          <Text style={styles.sortIndexText}>{props.item.bookSortIndex}</Text>
        </View>

        <View style={styles.rightContainer}>
          <View style={styles.rightTop}>
            <Text style={styles.title}>{props.item.bookCode}</Text>
            <Text style={styles.subTitle}>({props.item.custId})</Text>
          </View>
          <View style={styles.rightBottom}>
            <Image
              style={styles.iconLocation}
              source={require('../assets/qietu/cebenxiangqing/book_details_icon_address_normal.png')}
            />
            <Text style={styles.description}>{props.item.custAddress}</Text>
          </View>
        </View>
      </View>

      {props.showExtra ? (
        <View style={styles.extra}>
          <View style={styles.extraRow}>
            <View style={styles.extraRowPart}>
              <Text style={styles.extraLabel}>上期抄码</Text>
              <Text style={styles.extraValue}>{props.item.lastReading}</Text>
            </View>
            <View style={styles.extraRowPart}>
              <Text style={styles.extraLabel}>本期抄码</Text>
              <Text style={styles.extraValue}>{props.item.reading}</Text>
            </View>
          </View>
          <View style={styles.extraRow}>
            <View style={styles.extraRowPart}>
              <Text style={styles.extraLabel}>抄见水量</Text>
              <Text style={styles.extraValue}>{props.item.readWater}</Text>
            </View>
            <View style={styles.extraRowPart}>
              <Text style={styles.extraLabel}>抄表日期</Text>
              <Text style={styles.extraValue}>
                {dayjs(props.item.lastReadDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorWhite,
  },
  sortIndex: {
    backgroundColor: '#E7F2FF',
    width: scaleSize(150),
    height: scaleSize(160),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortIndexText: {
    color: '#669FEE',
    fontSize: scaleSize(56),
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
  },
  rightTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleSize(34),
    color: '#333333',
  },
  subTitle: {
    fontSize: scaleSize(30),
    color: '#333333',
    marginStart: scaleSize(17),
  },
  rightBottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: scaleSize(10),
  },
  description: {
    fontSize: scaleSize(26),
    color: '#666666',
    marginStart: scaleSize(15),
  },
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
    marginTop: scaleSize(5),
  },
  extra: {
    display: 'flex',
    flexDirection: 'column',
    marginHorizontal: scaleSize(16),
    padding: scaleSize(30),
    backgroundColor: '#FCFEFF',
  },
  extraRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  extraRowPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  extraLabel: {
    color: '#666666',
    fontSize: scaleSize(28),
  },
  extraValue: {
    color: '#066DF1',
    fontSize: scaleSize(28),
    marginStart: scaleSize(12),
  },
});

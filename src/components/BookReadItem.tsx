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

export default function BookReadItem(props: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.mainContainer}>
        <View style={styles.sortIndex}>
          <Text style={styles.sortIndexText}>{props.item.bookSortIndex}</Text>
        </View>

        <View
          style={{
            backgroundColor: '#E7E7E7',
            width: scaleSize(2),
            height: scaleSize(106),
          }}
        />

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
          <View style={styles.extraRowPart}>
            <Text style={styles.extraLabel}>抄见水量</Text>
            <Text style={styles.extraValue}>{props.item.readWater}</Text>
          </View>
        </View>
        <View style={styles.extraRow}>
          <View style={styles.extraRowPart} />
          <View style={[styles.extraRowPart, { justifyContent: 'flex-end' }]}>
            <Text style={styles.dateLabel}>抄表日期：</Text>
            <Text style={styles.dateValue}>
              {dayjs(props.item.lastReadDate).format('YYYY-MM-DD')}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    marginStart: scaleSize(30),
  },
  mainContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorWhite,
    borderBottomColor: '#F9F9F9',
    borderBottomWidth: scaleSize(2),
  },
  sortIndex: {
    backgroundColor: colorWhite,
    width: scaleSize(86),
    height: scaleSize(106),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortIndexText: {
    color: '#5384F9',
    fontSize: scaleSize(34),
    fontWeight: 'bold',
  },
  rightContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: scaleSize(14),
    // paddingVertical: scaleSize(20),
  },
  rightTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: scaleSize(30),
    color: '#333333',
  },
  subTitle: {
    fontSize: scaleSize(28),
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
    backgroundColor: '#FCFEFF',
  },
  extraRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(20),
  },
  extraRowPart: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flex: 1,
  },
  extraLabel: {
    color: '#666666',
    fontSize: scaleSize(24),
  },
  extraValue: {
    color: '#066DF1',
    fontSize: scaleSize(24),
    marginStart: scaleSize(12),
  },
  dateLabel: {
    color: '#999999',
    fontSize: scaleSize(20),
  },
  dateValue: {
    color: '#666666',
    fontSize: scaleSize(20),
  },
});

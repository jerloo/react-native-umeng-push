import dayjs from 'dayjs';
import * as React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadDataDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';
import { meterState, recordState } from '../utils/stateConverter';
import LocationButton from './LocationButton';

interface BookDataTagProps {
  title: string;
  titleColor: string;
  backgroundColor: string;
}

const tagStyles = StyleSheet.create({
  container: {
    paddingVertical: scaleSize(6),
    paddingHorizontal: scaleSize(20),
    margin: scaleSize(5),
  },
  title: {
    fontSize: scaleSize(24),
  },
});

const BookDataTag = ({
  title,
  backgroundColor,
  titleColor,
}: BookDataTagProps) => {
  return (
    <View style={[tagStyles.container, { backgroundColor }]}>
      <Text style={[tagStyles.title, { color: titleColor }]}>{title}</Text>
    </View>
  );
};

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
            width: scaleSize(4),
            height: scaleSize(106),
          }}
        />

        <View style={styles.rightContainer}>
          <View style={styles.rightTop}>
            <Text style={styles.title}>{props.item.custName}</Text>
            <Text style={styles.subTitle}>({props.item.custCode})</Text>
          </View>
          <View style={styles.rightBottom}>
            <LocationButton address={props.item.custAddress} />
            <Text style={styles.description}>{props.item.custAddress}</Text>
          </View>
        </View>
      </View>

      <View style={styles.extra}>
        <View
          style={[
            styles.extraRow,
            {
              marginTop: scaleSize(24),
              marginBottom: scaleSize(19),
              marginHorizontal: scaleSize(30),
            },
          ]}>
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
        <View style={[styles.extraRow, { paddingHorizontal: 0 }]}>
          <View style={styles.extraRowPart}>
            <BookDataTag
              title={recordState(props.item.recordState)}
              backgroundColor="#D8E5FF"
              titleColor="#5384F9"
            />
            <BookDataTag
              title={meterState(props.item.meterState)}
              backgroundColor="#D7DBFF"
              titleColor="#6371F4"
            />
            {props.item.oweNumber > 0 ? (
              <BookDataTag
                title="欠费"
                backgroundColor="#F5E2BC"
                titleColor="#EAAF38"
              />
            ) : null}
          </View>
          {props.item.recordState !== 0 ? (
            <View
              style={[
                styles.extraRowPart,
                { justifyContent: 'flex-end', marginEnd: scaleSize(30) },
              ]}>
              <Text style={styles.dateLabel}>抄表日期：</Text>
              <Text style={styles.dateValue}>
                {dayjs(props.item.lastReadDate).format('YYYY-MM-DD')}
              </Text>
            </View>
          ) : null}
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
    height: scaleSize(240),
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
    fontSize: scaleSize(32),
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
    backgroundColor: '#FCFEFF',
  },
  extraRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  dateLabel: {
    color: '#999999',
    fontSize: scaleSize(28),
  },
  dateValue: {
    color: '#666666',
    fontSize: scaleSize(28),
  },
});

import * as React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadingCollectDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';

interface Props {
  data: PdaReadingCollectDto;
}

const { width } = Dimensions.get('window');

export default function ReadingCollectItem({ data }: Props) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.progressContainer,
          {
            width:
              (data.actualRead / data.expectRead) * (width - scaleSize(60)),
          },
        ]}>
        <View style={styles.progressLine} />
      </View>
      <View style={styles.wrapper}>
        <Text style={styles.title}>{data.bookCode}</Text>
        <View style={[styles.row, { marginBottom: scaleSize(12) }]}>
          <View style={styles.cel}>
            <Text style={styles.label}>应抄：</Text>
            <Text style={styles.value}>{data.expectRead}</Text>
          </View>
          <View style={styles.cel}>
            <Text style={styles.label}>水量：</Text>
            <Text style={styles.value}>{data.totalWater}</Text>
          </View>
        </View>
        <View style={[styles.row, { marginBottom: scaleSize(38) }]}>
          <View style={styles.cel}>
            <Text style={styles.label}>实抄：</Text>
            <Text style={styles.value}>{data.actualRead}</Text>
          </View>
          <View style={styles.cel}>
            <Text style={styles.label}>金额：</Text>
            <Text style={styles.value}>{data.totalMoney}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colorWhite,
    borderRadius: scaleSize(8),
    marginHorizontal: scaleSize(30),
    marginTop: scaleSize(16),
    overflow: 'hidden',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: scaleSize(30),
  },
  title: {
    fontSize: scaleSize(34),
    color: '#333333',
    fontWeight: 'bold',
    marginVertical: scaleSize(18),
  },
  label: {
    fontSize: scaleSize(30),
    color: '#666666',
  },
  value: {
    fontSize: scaleSize(30),
    color: '#333333',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  cel: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
  progressContainer: {
    backgroundColor: '#F5F6FA',
    position: 'absolute',
    height: '100%',
    display: 'flex',
    flexDirection: 'column-reverse',
  },
  progressLine: {
    height: scaleSize(6),
    backgroundColor: '#7493FC',
    marginBottom: scaleSize(16),
  },
});

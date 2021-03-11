import * as React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaArrearageDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';

interface Props {
  data: PdaArrearageDto;
}

export default function ArrearageItem({ data }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {data.custName}({data.custCode})
      </Text>
      <View style={styles.content}>
        <View style={styles.contentLeft}>
          <Text style={styles.label}>客户地址</Text>
        </View>
        <View style={styles.contentRight}>
          <Text style={styles.value}>{data.custAddress}</Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.contentLeft}>
          <Text style={styles.label}>账单金额</Text>
          <Text style={styles.label}>违约金</Text>
          <Text style={styles.label}>应收金额</Text>
        </View>
        <View style={styles.contentRight}>
          <Text style={styles.value}>{data.totalExtendedAmount}</Text>
          <Text style={styles.value}>{data.totalLateFee}</Text>
          <Text style={[styles.value, { color: '#2660ED' }]}>
            {data.totalExtendedAmount}
          </Text>
        </View>
      </View>
      <View style={styles.line} />
      <View style={styles.bottom}>
        <Text style={styles.label}>账单详情</Text>
        <Image />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(20),
    backgroundColor: colorWhite,
    marginHorizontal: scaleSize(30),
    borderRadius: scaleSize(8),
  },
  title: {
    fontSize: scaleSize(34),
    color: '#333333',
    fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    flexDirection: 'row',
  },
  contentLeft: {
    display: 'flex',
    flexDirection: 'column',
  },
  contentRight: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  line: {
    height: scaleSize(1),
    backgroundColor: '#E1E8F4',
  },
  label: {
    color: '#333333',
    fontSize: scaleSize(28),
    marginVertical: scaleSize(8),
  },
  value: {
    fontSize: scaleSize(28),
    color: '#666666',
    marginVertical: scaleSize(8),
    marginStart: scaleSize(30),
  },
  bottom: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

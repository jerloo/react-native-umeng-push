import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaPaymentCollect } from '../../apiclient/src/models';
import { colorWhite } from '../styles';

interface Props {
  data: PdaPaymentCollect;
}
export default function PaymentCollectItem({ data }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.payDate}>{data.payDate}</Text>
      <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>实收金额</Text>
          <Text style={styles.value}>{data.actualMoney}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>销账金额</Text>
          <Text style={styles.value}>{data.soldMoney}</Text>
        </View>
      </View>
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>预存抵扣</Text>
          <Text style={styles.value}>{data.depositOut}</Text>
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>预存存入</Text>
          <Text style={styles.value}>{data.depositIn}</Text>
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
    borderRadius: scaleSize(10),
    marginHorizontal: scaleSize(30),
    paddingHorizontal: scaleSize(38),
    paddingVertical: scaleSize(28),
  },
  line: {
    height: scaleSize(1),
    backgroundColor: '#DEDEDE',
    marginTop: scaleSize(12),
  },
  payDate: {
    fontSize: scaleSize(34),
    color: '#333333',
    fontWeight: 'bold',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(24),
  },
  col: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: scaleSize(28),
    color: '#666666',
  },
  value: {
    fontSize: scaleSize(28),
    color: '#2660ED',
    marginStart: scaleSize(18),
  },
});

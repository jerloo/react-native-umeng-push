import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaPaymentCollect } from '../../apiclient/src/models';

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
  },
  line: {
    height: scaleSize(1),
    backgroundColor: '#DEDEDE',
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
  },
  col: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: scaleSize(28),
    color: '#666666',
  },
  value: {
    fontSize: scaleSize(28),
    color: '#2660ED',
  },
});

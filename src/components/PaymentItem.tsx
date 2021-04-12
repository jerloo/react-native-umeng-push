import dayjs from 'dayjs';
import * as React from 'react';
import {
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import { scaleSize } from 'react-native-responsive-design';
import { PdaChargeDetails, PdaChargeListDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';
import { sum } from '../utils/sumUtils';

interface Props {
  data: PdaChargeListDto;
}

export default function PaymentItem({ data }: Props) {
  const [expand, setExpand] = React.useState(false);

  const renderChargeDetailItem = (
    info: ListRenderItemInfo<PdaChargeDetails>,
  ) => {
    return (
      <View style={styles.tableRow}>
        <View
          style={[styles.tableCol, { flex: 2, backgroundColor: colorWhite }]}>
          <Text style={styles.tableValueText}>{info.item.feeItem}</Text>
        </View>
        <View
          style={[styles.tableCol, { flex: 2, backgroundColor: colorWhite }]}>
          <Text style={styles.tableValueText}>{info.item.price}</Text>
        </View>
        <View
          style={[styles.tableCol, { flex: 1, backgroundColor: colorWhite }]}>
          <Text style={styles.tableValueText}>{info.item.water}</Text>
        </View>
        <View
          style={[styles.tableCol, { flex: 1, backgroundColor: colorWhite }]}>
          <Text style={styles.tableValueText}>
            {info.item.money?.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const renderExpand = () => {
    return (
      <View style={styles.detailsContainer}>
        <View style={styles.details}>
          <View style={styles.detailsCol}>
            <View style={styles.detailsLabels}>
              <Text style={styles.detailsLabel}>上期抄码：</Text>
              <Text style={styles.detailsLabel}>本期抄码：</Text>
              <Text style={styles.detailsLabel}>账单金额：</Text>
            </View>
            <View style={styles.detailsValues}>
              <Text style={styles.detailsValue}>{data.lastReading}</Text>
              <Text style={styles.detailsValue}>{data.reading}</Text>
              <Text style={[styles.detailsValue, { color: '#F0655A' }]}>
                {data.extendedAmount?.toFixed(2)}
              </Text>
            </View>
          </View>
          <View style={styles.detailsCol}>
            <View style={styles.detailsLabels}>
              <Text style={styles.detailsLabel}>抄见水量：</Text>
              <Text style={styles.detailsLabel}>抄表日期：</Text>
              <Text style={[styles.detailsLabel, { textAlign: 'right' }]}>
                违约金：
              </Text>
            </View>
            <View style={styles.detailsValues}>
              <Text style={styles.detailsValue}>{data.readWater}</Text>
              <Text style={styles.detailsValue}>
                {dayjs(data.readingDate).format('YYYY-MM-DD')}
              </Text>
              <Text style={styles.detailsValue}>
                {data.lateFee?.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>费用组成</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>基本水价</Text>
            <Text style={styles.tableHeaderText}>水量</Text>
            <Text style={styles.tableHeaderText}>金额</Text>
          </View>
          <FlatList<PdaChargeDetails>
            data={data.chargeDetails}
            renderItem={renderChargeDetailItem}
            keyExtractor={(item) => item.feeItemCode}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: scaleSize(1),
                  backgroundColor: '#DEDEDE',
                  marginVertical: scaleSize(10),
                }}
              />
            )}
          />
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => setExpand(!expand)}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{data.billMonth}账单</Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text style={styles.amount}>{((data.extendedAmount || 0) + (data.lateFee || 0))?.toFixed(2)}</Text>
          <Image
            resizeMode="contain"
            style={{
              width: scaleSize(20),
              height: scaleSize(20),
              marginStart: scaleSize(28),
            }}
            source={
              expand
                ? require('../assets/qietu/shoufei/expand_down.png')
                : require('../assets/qietu/shoufei/expand_right.png')
            }
          />
        </View>
      </View>

      {expand ? renderExpand() : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWhite,
    borderRadius: scaleSize(8),
    marginHorizontal: scaleSize(30),
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(21),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: scaleSize(36),
  },
  amount: {
    color: '#F0655A',
    fontSize: scaleSize(36),
  },
  detailsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  details: {
    display: 'flex',
    flexDirection: 'row',
  },
  detailsCol: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
  },
  detailsLabels: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailsValues: {
    display: 'flex',
    flexDirection: 'column',
  },
  detailsLabel: {
    fontSize: scaleSize(30),
    color: '#999999',
    marginTop: scaleSize(18),
  },
  detailsValue: {
    fontSize: scaleSize(30),
    color: '#333333',
    marginTop: scaleSize(18),
  },
  tableHeaderText: {
    color: '#666666',
    fontSize: scaleSize(28),
    flex: 1,
  },
  tableValueText: {
    color: '#333333',
    fontSize: scaleSize(26),
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#F9F9F9',
    justifyContent: 'space-between',
    paddingVertical: scaleSize(10),
    paddingHorizontal: scaleSize(18),
    borderRadius: scaleSize(8),
    marginBottom: scaleSize(12),
  },
  tableCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  table: {
    marginTop: scaleSize(20),
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: scaleSize(18),
  },
});

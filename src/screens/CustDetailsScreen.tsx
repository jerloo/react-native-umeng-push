import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  Text,
  FlatList,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize } from 'react-native-responsive-design';
import {
  PdaBillingInfo,
  PdaCustDto,
  PdaPayRecord,
  PdaReadingRecord,
} from '../../apiclient/src/models';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import { Tabs } from '@ant-design/react-native';
import dayjs from 'dayjs';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import { TextInput } from 'react-native-gesture-handler';

export default function CustDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<MainStackParamList, 'CustDetails'>>();

  const [details, setDetails] = useState<PdaCustDto>();

  useEffect(() => {
    const { data } = route.params;

    const fetchRemote = async () => {
      try {
        const res = await center.online.getCustDetails([data.custId]);
        setDetails((res as PdaCustDto[])[0]);
      } catch (e) {
        Toast.fail(e.message);
      }
    };
    fetchRemote();
  }, [route.params]);

  const refresh = async () => {
    const key = Toast.loading('加载中');
    const { data } = route.params;
    try {
      const res = await center.online.getCustDetails([data.custId]);
      setDetails((res as PdaCustDto[])[0]);
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      Toast.remove(key);
    }
  };

  const line = () => {
    return (
      <View style={{ height: scaleSize(1), backgroundColor: '#DEDEDE' }} />
    );
  };

  const renderBasicInfo = () => {
    return (
      <View style={styles.table}>
        <View style={styles.tableLeft}>
          <Text style={styles.tableLabel}>客户户号</Text>
          {line()}
          <Text style={styles.tableLabel}>用户名称</Text>
          {line()}
          <Text style={styles.tableLabel}>客户地址</Text>
          {line()}
          <Text style={styles.tableLabel}>营业站点</Text>
          {line()}
          <Text style={styles.tableLabel}>预存余额</Text>
          {line()}
          <Text style={styles.tableLabel}>联系方式</Text>
          {line()}
          <Text style={styles.tableLabel}>缴费方式</Text>
          {line()}
          <Text style={styles.tableLabel}>客户类型</Text>
          {line()}
          <Text style={styles.tableLabel}>用水性质</Text>
          {line()}
          <Text style={styles.tableLabel}>年累积量</Text>
          {line()}
          <Text style={styles.tableLabel}>当前底码</Text>
          {line()}
          <Text style={styles.tableLabel}>安装位置</Text>
          {line()}
          <Text style={styles.tableLabel}>表钢印号</Text>
          {line()}
          <Text style={styles.tableLabel}>水表口径</Text>
          {line()}
          <Text style={styles.tableLabel}>水表厂家</Text>
          {line()}
          <Text style={styles.tableLabel}>换表日期</Text>
          {line()}
          <Text style={styles.tableLabel}>立户日期</Text>
        </View>
        <View style={styles.tableRight}>
          <Text style={styles.tableValue}>{route.params.data.custCode}</Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.custName}</Text>
          {line()}
          <Text style={styles.tableValue}>
            {details?.custInfo?.custAddress}
          </Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.orgName}</Text>
          {line()}
          <Text style={[styles.tableValue, styles.redText]}>
            {details?.custInfo?.deposit}
          </Text>
          {line()}
          <TextInput
            style={[styles.tableValue, styles.blackText]}
            defaultValue={details?.custInfo?.mobile}
          />

          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.payMethod}</Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.custType}</Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.priceCode}</Text>
          {line()}
          <Text style={styles.tableValue}>
            {details?.custInfo?.yearTotalWater}
          </Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.reading}</Text>
          {line()}
          <Text style={[styles.tableValue, styles.blackText]}>
            {details?.custInfo?.installLocation}
          </Text>
          {line()}
          <Text style={[styles.tableValue, styles.blackText]}>
            {details?.custInfo?.steelMark}
          </Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.caliber}</Text>
          {line()}
          <Text style={styles.tableValue}>{details?.custInfo?.producer}</Text>
          {line()}
          <Text style={styles.tableValue}>
            {dayjs(details?.custInfo?.replaceDate).format('YYYY-MM-DD')}
          </Text>
          {line()}
          <Text style={styles.tableValue}>
            {dayjs(details?.custInfo?.buildDate).format('YYYY-MM-DD')}
          </Text>
          {line()}
        </View>
      </View>
    );
  };

  const renderReadingRecord = (info: ListRenderItemInfo<PdaReadingRecord>) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>
          {dayjs(info.item.readingDate).format('YYYY-MM-DD')}
        </Text>
        <Text style={styles.listItemText}>{info.item.lastReading}</Text>
        <Text style={styles.listItemText}>{info.item.reading}</Text>
        <Text style={styles.listItemText}>{info.item.readWater}</Text>
      </View>
    );
  };

  const renderBillingRecord = (info: ListRenderItemInfo<PdaBillingInfo>) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>{info.item.billMonth}</Text>
        <Text style={styles.listItemText}>{info.item.billWater}</Text>
        <Text style={styles.listItemText}>{info.item.extendedAmount}</Text>
        <Text style={styles.listItemText}>{info.item.lateFee}</Text>
      </View>
    );
  };

  const renderPayRecord = (info: ListRenderItemInfo<PdaPayRecord>) => {
    return (
      <View style={styles.listItem}>
        <Text style={styles.listItemText}>
          {dayjs(info.item.payDate).format('YYYY-MM-DD')}
        </Text>
        <Text style={styles.listItemText}>{info.item.cashier}</Text>
        <Text style={styles.listItemText}>{info.item.actualMoney}</Text>
        <Text style={styles.listItemText}>{info.item.deposit}</Text>
      </View>
    );
  };

  const renderHeader = (headers: string[]) => {
    return (
      <View style={[styles.listItem, styles.listItemDark]}>
        {headers.map((value) => (
          <Text style={styles.listItemText}>{value}</Text>
        ))}
      </View>
    );
  };

  const sum = (array: number[]) => {
    let s = 0;
    for (let i = 0; i < array.length; i++) {
      s += array[i];
    }
    return s;
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={['#3273E4', '#3273E4']}
        style={styles.topContainer}>
        <SafeAreaView>
          <CommonTitleBarEx
            onBack={() => navigation.goBack()}
            right2Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
            onRight2Click={refresh}
            title={`${route.params.data.custName}(${route.params.data.custCode})`}
            titleColor={colorWhite}
          />
        </SafeAreaView>
      </LinearGradient>

      <Tabs
        style={{ backgroundColor: colorWhite }}
        tabs={[
          {
            title: '基础信息',
          },
          {
            title: '抄表信息',
          },
          { title: '账单信息' },
          { title: '缴费记录' },
        ]}
        tabBarBackgroundColor="#3273E4"
        tabBarTextStyle={{ color: colorWhite }}
        tabBarUnderlineStyle={{
          height: scaleSize(6),
          borderColor: colorWhite,
          backgroundColor: colorWhite,
        }}>
        <ScrollView style={styles.basicInfo}>{renderBasicInfo()}</ScrollView>

        <View style={styles.readingRecords}>
          <View style={styles.topRow}>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>笔数：</Text>
              <Text style={styles.topValue}>
                {details?.readingRecords?.length || 0}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>水量：</Text>
              <Text style={styles.topValue}>
                {sum(
                  details?.readingRecords?.map((value) => value.readWater) ||
                    [],
                )}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel} />
              <Text style={styles.topValue} />
            </View>
          </View>

          {renderHeader(['抄表日期', '上期抄码', '本次抄码', '本期水量'])}

          <FlatList<PdaReadingRecord>
            data={details?.readingRecords}
            renderItem={renderReadingRecord}
            ItemSeparatorComponent={() => (
              <View style={{ height: scaleSize(18) }} />
            )}
            keyExtractor={(item) => 'read-' + item.readingDate.toString()}
            contentInset={{ bottom: 100 }}
            contentContainerStyle={{
              paddingBottom: scaleSize(30),
            }}
          />
        </View>

        <View style={styles.readingRecords}>
          <View style={styles.topRow}>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>笔数：</Text>
              <Text style={styles.topValue}>
                {details?.billingInfos?.length || 0}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>水量：</Text>
              <Text style={styles.topValue}>
                {sum(
                  details?.billingInfos?.map((value) => value.billWater) || [],
                )}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>合计金额：</Text>
              <Text style={[styles.topValue, styles.redText]}>
                {sum(
                  details?.billingInfos?.map((it) => it.extendedAmount) || [],
                )}
              </Text>
            </View>
          </View>

          {renderHeader(['账务年月', '开账水量', '账单金额', '违约金'])}

          <FlatList<PdaBillingInfo>
            data={details?.billingInfos}
            renderItem={renderBillingRecord}
            ItemSeparatorComponent={() => (
              <View style={{ height: scaleSize(18) }} />
            )}
            keyExtractor={(item) => 'read-' + item.billMonth.toString()}
            contentInset={{ bottom: 100 }}
            contentContainerStyle={{
              paddingBottom: scaleSize(30),
            }}
          />
        </View>

        <View style={styles.readingRecords}>
          <View style={styles.topRow}>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>笔数：</Text>
              <Text style={styles.topValue}>
                {details?.payRecords?.length || 0}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>合计金额：</Text>
              <Text style={[styles.topValue, styles.redText]}>
                {sum(details?.payRecords?.map((it) => it.actualMoney) || [])}
              </Text>
            </View>
          </View>

          {renderHeader(['缴费时间', '收费渠道', '实缴金额', '余额'])}

          <FlatList<PdaPayRecord>
            data={details?.payRecords}
            renderItem={renderPayRecord}
            ItemSeparatorComponent={() => (
              <View style={{ height: scaleSize(18) }} />
            )}
            keyExtractor={(item) => 'read-' + item.payDate.toString()}
            contentInset={{ bottom: 100 }}
            contentContainerStyle={{
              paddingBottom: scaleSize(30),
            }}
          />
        </View>
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topContainer: {
    paddingBottom: scaleSize(30),
  },
  basicInfo: {
    paddingHorizontal: scaleSize(32),
    paddingTop: scaleSize(20),
  },
  table: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableRight: {
    flex: 1,
  },
  tableLabel: {
    color: '#666666',
    fontSize: scaleSize(28),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(6),
  },
  tableValue: {
    color: '#999999',
    fontSize: scaleSize(28),
    marginStart: scaleSize(30),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(6),
  },
  tableLeft: {},
  readingRecords: {
    backgroundColor: colorWhite,
  },
  topRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: scaleSize(1),
    marginTop: scaleSize(45),
    paddingHorizontal: scaleSize(32),
    paddingBottom: scaleSize(16),
    alignItems: 'center',
    marginBottom: scaleSize(24),
  },
  topCol: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  topLabel: {
    fontSize: scaleSize(28),
    color: '#999999',
  },
  topValue: {
    fontSize: scaleSize(34),
    color: '#333333',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scaleSize(32),
    paddingVertical: scaleSize(15),
    paddingHorizontal: scaleSize(12),
    borderWidth: scaleSize(1),
    borderColor: '#DEDEDE',
  },
  listItemText: {
    fontSize: scaleSize(28),
    color: '#333333',
    flex: 1,
  },
  listItemDark: {
    backgroundColor: '#F3F3F5',
  },
  redText: {
    color: '#EF5448',
  },
  blackText: {
    color: '#333333',
  },
});

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
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize } from 'react-native-responsive-design';
import {
  PdaBillingInfo,
  PdaCustDto,
  PdaCustInfo,
  PdaPayRecord,
  PdaReadingRecord,
} from '../../apiclient/src/models';
import center from '../data';
import { Modal, Toast } from '@ant-design/react-native';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import { Tabs } from '@ant-design/react-native';
import dayjs from 'dayjs';
import {
  NavigationProp,
  RouteProp,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import PureInput from '../components/PureInput';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { sum, sumNoFixed } from '../utils/sumUtils';
import { CustInfoModifyInputDto } from '../../apiclient/src/models/cust-info-modify-input-dto';
import LocationButton from '../components/LocationButton';
import { getSystemSettings } from '../utils/systemSettingsUtils';

export default function CustDetailsScreen() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();
  const route = useRoute<RouteProp<MainStackParamList, 'CustDetails'>>();

  const [details, setDetails] = useState<PdaCustDto>();
  const [onlyShowOwe, setOnlyShowOwe] = useState(false);
  const [canPay, setCanPay] = useState(false);

  useEffect(() => {
    getSystemSettings().then((r) => {
      if (r) {
        setCanPay(r.isMobileReadingCanCharge);
      }
    });
  }, []);

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

  const updateBasicInfo = async (custId: number, info: PdaCustInfo) => {
    const key = Toast.loading('修改中');
    try {
      const input: CustInfoModifyInputDto = {
        custId: custId,
        oldInstallLocation: details?.custInfo?.installLocation,
        oldMobile: details?.custInfo?.mobile,
        oldSteelMark: details?.custInfo?.steelMark,
        newInstallLocation: info.installLocation,
        newMobile: info.mobile,
        newSteelMark: info.steelMark,
      };
      await center.updateCustInfo(input);
      setDetails({ ...details, custInfo: info });
      Toast.success('修改成功');
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      Toast.remove(key);
    }
  };

  const showInstallLocationInput = async () => {
    Modal.prompt(
      '安装位置',
      '',
      (text) => {
        const info = { ...details?.custInfo };
        if (info && details?.custId) {
          info.installLocation = text;
          updateBasicInfo(details?.custId, info);
        }
      },
      'default',
      details?.custInfo?.installLocation,
    );
  };

  const showMobileInput = async () => {
    Modal.prompt(
      '联系方式',
      '',
      (text) => {
        if (!/^1[0-9]{10}$/.test(text)) {
          Toast.fail('请输入正确的手机号');
          return;
        }
        const info = { ...details?.custInfo };
        if (info && details?.custId) {
          info.mobile = text;
          updateBasicInfo(details?.custId, info);
        }
      },
      'default',
      details?.custInfo?.mobile,
    );
  };

  const showSteelInput = async () => {
    Modal.prompt(
      '表钢印号',
      '',
      (text) => {
        const info = { ...details?.custInfo };
        if (info && details?.custId) {
          info.steelMark = text;
          updateBasicInfo(details?.custId, info);
        }
      },
      'default',
      details?.custInfo?.steelMark,
    );
  };

  const renderBasicInfo = () => {
    return (
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>客户户号</Text>
          <Text style={styles.tableValue}>{route.params.data.custCode}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>用户名称</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.custName}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>客户地址</Text>

          <Text style={styles.tableValue}>
            {details?.custInfo?.custAddress}
            <LocationButton address={details?.custInfo?.custAddress} />
          </Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>营业站点</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.orgName}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>预存余额</Text>
          <Text style={[styles.tableValue, styles.redText]}>
            {details?.custInfo?.deposit}
          </Text>
        </View>
        {line()}
        <View style={[styles.tableRow, { marginTop: scaleSize(18) }]}>
          <Text style={[styles.tableLabel, { marginTop: 0 }]}>联系方式</Text>
          <PureInput
            style={{
              marginTop: 0,
              marginBottom: 0,
              marginStart: scaleSize(30),
              padding: 0,
              flex: 1,
              backgroundColor: '#ebf0ec',
            }}
            placeholder="请输入"
            showSoftInputOnFocus={false}
            onFocus={showMobileInput}
            returnKeyType="done"
            fontColor="#999999"
            fontSize={scaleSize(28)}
            defaultValue={details?.custInfo?.mobile}
            // onEndEditing={(e) => {
            //   const info = { ...details?.custInfo };
            //   if (info) {
            //     info.mobile = e.nativeEvent.text;
            //     updateBasicInfo(details?.custId, info);
            //   }
            // }}
          />
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>缴费方式</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.payMethod}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>客户类型</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.custType}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>用水性质</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.priceCode}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>年累积量</Text>
          <Text style={styles.tableValue}>
            {details?.custInfo?.yearTotalWater}
          </Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>当前底码</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.reading}</Text>
        </View>
        {line()}
        <View style={[styles.tableRow, { marginTop: scaleSize(18) }]}>
          <Text style={[styles.tableLabel, { marginTop: 0 }]}>安装位置</Text>
          <PureInput
            style={{
              marginTop: 0,
              marginBottom: 0,
              marginStart: scaleSize(30),
              padding: 0,
              flex: 1,
              backgroundColor: '#ebf0ec',
            }}
            placeholder="请输入"
            fontColor="#999999"
            fontSize={scaleSize(28)}
            defaultValue={details?.custInfo?.installLocation}
            returnKeyType="done"
            onFocus={showInstallLocationInput}
            showSoftInputOnFocus={false}
            // onEndEditing={(e) => {
            //   const info = { ...details?.custInfo };
            //   if (info) {
            //     info.installLocation = e.nativeEvent.text;
            //     updateBasicInfo(details?.custId, info);
            //   }
            // }}
          />
        </View>
        {line()}
        <View style={[styles.tableRow, { marginTop: scaleSize(18) }]}>
          <Text style={[styles.tableLabel, { marginTop: 0 }]}>表钢印号</Text>
          <PureInput
            style={{
              marginBottom: 0,
              marginStart: scaleSize(30),
              padding: 0,
              flex: 1,
              backgroundColor: '#ebf0ec',
            }}
            placeholder="请输入"
            onFocus={showSteelInput}
            fontColor="#999999"
            fontSize={scaleSize(28)}
            defaultValue={details?.custInfo?.steelMark}
            returnKeyType="done"
            showSoftInputOnFocus={false}
            // onEndEditing={(e) => {
            //   const info = { ...details?.custInfo };
            //   if (info) {
            //     info.steelMark = e.nativeEvent.text;
            //     updateBasicInfo(details?.custId, info);
            //   }
            // }}
          />
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>水表口径</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.caliber}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>水表厂家</Text>
          <Text style={styles.tableValue}>{details?.custInfo?.producer}</Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>换表日期</Text>
          <Text style={styles.tableValue}>
            {dayjs(details?.custInfo?.replaceDate).format('YYYY-MM-DD')}
          </Text>
        </View>
        {line()}
        <View style={styles.tableRow}>
          <Text style={styles.tableLabel}>立户日期</Text>
          <Text style={styles.tableValue}>
            {dayjs(details?.custInfo?.buildDate).format('YYYY-MM-DD')}
          </Text>
        </View>
      </View>
    );
  };

  const getStyleByIndex = (index: number) => {
    return index % 2 === 1
      ? [styles.listItem, styles.listItemDark]
      : [styles.listItem];
  };

  const renderReadingRecord = (info: ListRenderItemInfo<PdaReadingRecord>) => {
    return (
      <View style={getStyleByIndex(info.index)}>
        <Text style={[styles.listItemText, { flex: 2 }]}>
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
      <View style={getStyleByIndex(info.index)}>
        <Text style={[styles.listItemText, { flex: 2 }]}>
          {info.item.billMonth}
        </Text>
        <Text style={styles.listItemText}>{info.item.billWater}</Text>
        <Text style={styles.listItemText}>{info.item.extendedAmount}</Text>
        <Text style={styles.listItemText}>{info.item.lateFee}</Text>
      </View>
    );
  };

  const renderPayRecord = (info: ListRenderItemInfo<PdaPayRecord>) => {
    return (
      <View style={getStyleByIndex(info.index)}>
        <Text style={[styles.listItemText, { flex: 2 }]}>
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

  const renderReadingHeader = () => {
    return (
      <View style={[styles.listItem, styles.listItemDark]}>
        <Text style={[styles.listItemText, { flex: 2 }]}>抄表日期</Text>
        <Text style={styles.listItemText}>上期抄码</Text>
        <Text style={styles.listItemText}>本次抄码</Text>
        <Text style={styles.listItemText}>本期水量</Text>
      </View>
    );
  };

  const renderBillsHeader = () => {
    return (
      <View style={[styles.listItem, styles.listItemDark]}>
        <Text style={[styles.listItemText, { flex: 2 }]}>账务年月</Text>
        <Text style={styles.listItemText}>开账水量</Text>
        <Text style={styles.listItemText}>账单金额</Text>
        <Text style={styles.listItemText}>违约金</Text>
      </View>
    );
  };

  const renderPayHeader = () => {
    return (
      <View style={[styles.listItem, styles.listItemDark]}>
        <Text style={[styles.listItemText, { flex: 2 }]}>缴费时间</Text>
        <Text style={styles.listItemText}>收费渠道</Text>
        <Text style={styles.listItemText}>实缴金额</Text>
        <Text style={styles.listItemText}>余额</Text>
      </View>
    );
  };

  const onPayButtonClick = () => {
    if (details?.billingInfos?.filter((it) => it.payState === 0).length === 0) {
      Toast.info('当前未欠费');
    } else {
      navigation.navigate('Payment', {
        mode: 'pay',
        data: {
          custId: details?.custId,
        },
      });
    }
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
        <SafeAreaView edges={['top']}>
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
                {sumNoFixed(
                  details?.readingRecords?.map((value) => value.readWater) ||
                    [],
                ).toFixed(0)}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel} />
              <Text style={styles.topValue} />
            </View>
          </View>

          {renderReadingHeader()}

          <FlatList<PdaReadingRecord>
            data={details?.readingRecords}
            renderItem={renderReadingRecord}
            keyExtractor={(item) => 'read-' + item.readingDate.toString()}
            contentInset={{ bottom: 100 }}
            contentContainerStyle={{
              paddingBottom: scaleSize(30),
            }}
          />
        </View>

        <View style={[styles.readingRecords, { flex: 1 }]}>
          <View style={styles.topRow}>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>笔数：</Text>
              <Text style={styles.topValue}>
                {(onlyShowOwe
                  ? details?.billingInfos?.filter((it) => it.payState === 0)
                  : details?.billingInfos
                )?.length || 0}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>水量：</Text>
              <Text style={styles.topValue}>
                {sumNoFixed(
                  (onlyShowOwe
                    ? details?.billingInfos?.filter((it) => it.payState === 0)
                    : details?.billingInfos
                  )?.map((value) => value.billWater) || [],
                ).toFixed(0)}
              </Text>
            </View>
            <View style={styles.topCol}>
              <Text style={styles.topLabel}>金额：</Text>
              <Text style={[styles.topValue, styles.redText]}>
                {sum(
                  (onlyShowOwe
                    ? details?.billingInfos?.filter((it) => it.payState === 0)
                    : details?.billingInfos
                  )?.map((it) => it.extendedAmount) || [],
                )}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.rememberContainer}
            onPress={() => {
              setOnlyShowOwe(!onlyShowOwe);
            }}>
            {onlyShowOwe ? (
              <View style={[styles.rememberIconContainer]}>
                <Image
                  style={styles.rememberIcon}
                  source={require('../assets/login_remember_checked.png')}
                />
              </View>
            ) : (
              <View style={[styles.rememberIconContainer]}>
                <Image
                  style={styles.rememberIcon}
                  source={require('../assets/login_remember_unchecked.png')}
                />
              </View>
            )}
            <Text style={styles.rememberTitle}>仅显示欠费</Text>
          </TouchableOpacity>

          {renderBillsHeader()}

          <FlatList<PdaBillingInfo>
            data={
              onlyShowOwe
                ? details?.billingInfos?.filter((it) => it.payState === 0)
                : details?.billingInfos
            }
            renderItem={renderBillingRecord}
            keyExtractor={(item) => 'read-' + item.billMonth.toString()}
            contentInset={{ bottom: 100 }}
            contentContainerStyle={{
              paddingBottom: scaleSize(30),
            }}
            // style={{ flex: 1 }}
          />

          {canPay ? (
            <TouchableOpacity
              style={styles.payButton}
              onPress={onPayButtonClick}>
              <Text style={styles.payButtonText}>去收费</Text>
            </TouchableOpacity>
          ) : null}
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
              <Text style={styles.topLabel}>金额：</Text>
              <Text style={[styles.topValue, styles.redText]}>
                {sum(details?.payRecords?.map((it) => it.actualMoney) || [])}
              </Text>
            </View>
          </View>

          {renderPayHeader()}

          <FlatList<PdaPayRecord>
            data={details?.payRecords}
            renderItem={renderPayRecord}
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
    flexDirection: 'column',
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
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberContainer: {
    borderWidth: 0,
    width: '100%',
    marginStart: 0,
    backgroundColor: 'transparent',
    // backgroundColor: 'blue',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scaleSize(30),
    paddingStart: scaleSize(30),
    marginBottom: scaleSize(16),
  },
  rememberIcon: {
    width: scaleSize(24),
    height: scaleSize(24),
  },
  rememberIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberTitle: {
    fontSize: scaleSize(24),
    marginStart: scaleSize(16),
  },
  payButton: {
    marginHorizontal: scaleSize(74),
    marginVertical: scaleSize(30),
    backgroundColor: '#5397F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scaleSize(10),
    paddingVertical: scaleSize(19),
  },
  payButtonText: {
    fontSize: scaleSize(40),
    color: colorWhite,
  },
});

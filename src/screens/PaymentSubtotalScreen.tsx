import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import {
  PdaArrearageDto,
  PdaPaymentCollectInput,
  PdaPaymentSubtotal,
  PdaPaySubtotalsDto,
} from '../../apiclient/src/models';
import center from '../data';
import { Toast, DatePicker } from '@ant-design/react-native';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import SearchBox from '../components/SearchBox';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import dayjs from 'dayjs';
import { getSession, UserSession } from '../utils/sesstionUtils';
import SubtotalItem from '../components/SubtotalItem';

const PAGE_SIZE = 30;

export default function PaymentSubtotalScreen() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const defaultBillMonth = parseInt(dayjs().format('YYYYMMDD'), 10);
  const [session, setSession] = useState<UserSession>();

  const [data, setData] = useState<PdaPaySubtotalsDto>();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<PdaPaymentCollectInput>({
    maxResultCount: PAGE_SIZE,
    beginDate: defaultBillMonth,
    endDate: defaultBillMonth,
  });
  const fRef = React.useRef<FlatList>();

  useEffect(() => {
    getSession().then((it) => setSession(it || undefined));
  }, []);

  const refresh = async () => {
    if (loading) {
      return;
    }

    const ps = params;
    ps.skipCount = 0;
    ps.maxResultCount = PAGE_SIZE;
    ps.meterReaderId = session?.userInfo.id;

    setLoading(true);
    try {
      const res = await center.getPaymentSubtotal(ps);
      setData(res);
      setParams(ps);
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = async () => {
    const ps = params;
    ps.skipCount = ps.skipCount || 0 + PAGE_SIZE;
    ps.maxResultCount = PAGE_SIZE;

    try {
      const res = await center.getPaymentSubtotal(ps);
      const newData: PdaPaySubtotalsDto = {
        ...data,
        paySubtotals: {
          items: [
            ...(data?.paySubtotals?.items || []),
            ...(res.paySubtotals?.items || []),
          ],
        },
      };
      setData(newData);
      setParams(ps);
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  const onStartPick = (dt: Date) => {
    const value = parseInt(dayjs(dt).format('YYYYMMDD'), 10);
    console.log('onPickBillMonth', value);
    setParams({ ...params, beginDate: value });
  };

  const onEndPick = (dt: Date) => {
    const value = parseInt(dayjs(dt).format('YYYYMMDD'), 10);
    console.log('onPickBillMonth', value);
    setParams({ ...params, endDate: value });
  };

  const getItemLayout = (data, index) => ({
    length: scaleSize(439 + 18),
    offset: scaleSize(439 + 18) * index,
    index,
  });

  const findIndex = (d: PdaArrearageDto[], text: string) => {
    return d.findIndex(
      (it) =>
        (it.custName || '').indexOf(text) > -1 ||
        (it.custCode?.toString() || '').indexOf(text) > -1 ||
        (it.custAddress || '').indexOf(text) > -1,
    );
  };

  const onSearch = (text: string) => {
    const index = findIndex(data?.paySubtotals?.items, text);
    if (index > -1) {
      fRef.current?.scrollToIndex({ animated: true, index });
    }
  };

  const renderQuery = () => {
    return (
      <View style={styles.queryContainer}>
        <Text style={styles.settingsSubTitle}>收费时间</Text>
        <View style={styles.settingsDatePickers}>
          <DatePicker
            value={dayjs(params.beginDate, 'YYYYMMDD').toDate()}
            mode="month"
            defaultDate={new Date()}
            minDate={new Date(2015, 7, 6)}
            maxDate={new Date(2026, 11, 3)}
            onChange={onStartPick}
            format="YYYY-MM-DD">
            <TouchableOpacity
              style={[styles.settingsInput, { width: scaleSize(196) }]}>
              <Text style={styles.settingsInputText}>
                {dayjs(params.beginDate.toString(), 'YYYYMMDD').format(
                  'YYYY-MM-DD',
                )}
              </Text>
              <Image
                style={styles.settingsInputIcon}
                source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
              />
            </TouchableOpacity>
          </DatePicker>
          <Text>至</Text>
          <DatePicker
            value={dayjs(params.endDate, 'YYYYMMDD').toDate()}
            mode="month"
            defaultDate={new Date()}
            minDate={new Date(2015, 7, 6)}
            maxDate={new Date(2026, 11, 3)}
            onChange={onEndPick}
            format="YYYY-MM-DD">
            <TouchableOpacity
              style={[styles.settingsInput, { width: scaleSize(196) }]}>
              <Text style={styles.settingsInputText}>
                {dayjs(params.endDate.toString(), 'YYYYMMDD').format(
                  'YYYY-MM-DD',
                )}
              </Text>
              <Image
                style={styles.settingsInputIcon}
                source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
              />
            </TouchableOpacity>
          </DatePicker>
        </View>
      </View>
    );
  };

  const renderItem = (info: ListRenderItemInfo<PdaPaymentSubtotal>) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Payment', {
            custId: info.item.custId,
            custCode: info.item.custCode,
          })
        }>
        <SubtotalItem data={info.item} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={['#4888E3', '#2567E5']}
        style={styles.topContainer}>
        <SafeAreaView>
          <CommonTitleBarEx
            onBack={() => navigation.goBack()}
            onRight2Click={refresh}
            right2Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
            title={'收费明细'}
            titleColor={colorWhite}
          />
          <SearchBox
            style={styles.searchContainer}
            placeholderTextColor={colorWhite}
            onSearch={onSearch}
          />
          <View style={styles.topBox}>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>{data?.custCount || '-'}</Text>
              <Text style={styles.topItemLabel}>应抄</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>
                {data?.actualMoney || '-'}
              </Text>
              <Text style={styles.topItemLabel}>实收金额</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>{data?.soldMoney || '-'}</Text>
              <Text style={styles.topItemLabel}>销账金额</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {renderQuery()}

      <FlatList<PdaArrearageDto>
        ref={fRef}
        style={styles.items}
        initialNumToRender={10}
        data={data?.paySubtotals?.items || []}
        refreshing={loading}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleSize(18) }} />
        )}
        keyExtractor={(item) => item.custId.toString()}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
          paddingTop: scaleSize(18),
        }}
        onRefresh={refresh}
        onEndReached={nextPage}
      />
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
    height: scaleSize(300),
  },
  topBox: {
    backgroundColor: colorWhite,
    borderRadius: scaleSize(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: scaleSize(30),
    paddingVertical: scaleSize(24),
    marginTop: scaleSize(32),
  },
  topItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topItemLabel: {
    color: '#666666',
    fontSize: setSpText2(34),
  },
  topItemValue: {
    color: '#333333',
    fontSize: setSpText2(44),
    fontWeight: 'bold',
  },
  items: {
    // backgroundColor: colorWhite,
    // marginTop: scaleSize(100),
    // marginTop: scaleSize(100),
  },
  item: {
    // marginHorizontal: scaleSize(30),
    marginTop: scaleSize(18),
  },
  bottomContainer: {
    paddingHorizontal: scaleSize(30),
    paddingVertical: scaleSize(21),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colorWhite,
  },
  bottomLabel: {
    color: '#5598F4',
    fontSize: scaleSize(28),
    marginEnd: scaleSize(24),
  },
  btnDone: {
    backgroundColor: '#096BF3',
    paddingVertical: scaleSize(4),
    paddingHorizontal: scaleSize(22),
    borderRadius: scaleSize(6),
  },
  btnDoneText: {
    fontSize: setSpText2(28),
    color: colorWhite,
  },
  bottomRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rowHidden: {
    // marginTop: scaleSize(18),
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  rowHiddenStatic: {
    backgroundColor: '#4B90F2',
  },
  rowHiddenDelete: {
    backgroundColor: '#F0655A',
  },
  searchContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: scaleSize(30),
  },
  settings: {
    display: 'flex',
    flexDirection: 'column',
  },
  settingsTop: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scaleSize(31),
    marginTop: scaleSize(20),
  },
  settingsTitle: {
    fontSize: scaleSize(38),
    color: '#333333',
    marginStart: scaleSize(17),
  },
  settingsSubTitle: {
    fontSize: scaleSize(28),
    color: '#333333',
  },
  settingsContent: {
    display: 'flex',
    flexDirection: 'column',
    paddingHorizontal: scaleSize(31),
  },
  settingsIcon: {
    width: scaleSize(40),
    height: scaleSize(40),
  },
  settingsInput: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderColor: '#A8A8A8',
    borderRadius: scaleSize(9),
    borderWidth: scaleSize(1),
    paddingHorizontal: scaleSize(12),
    paddingVertical: scaleSize(5),
    marginHorizontal: scaleSize(11),
  },
  settingsInputIconUser: {
    width: scaleSize(22),
    height: scaleSize(23),
    marginEnd: scaleSize(16),
  },
  settingsInputIcon: {
    width: scaleSize(14),
    height: scaleSize(9),
  },
  settingsInputText: {
    fontSize: scaleSize(24),
    color: '#666666',
    flex: 1,
  },
  settingsDatePickers: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  settingsDatePicker: {
    flex: 1,
  },
  settingsModalContent: {
    width: scaleSize(509),
    backgroundColor: colorWhite,
    height: '100%',
    paddingTop: StatusBar.currentHeight,
  },
  resetButton: {
    backgroundColor: '#EBEBEB',
    borderRadius: scaleSize(30),
    paddingVertical: scaleSize(9),
    paddingHorizontal: scaleSize(50),
  },
  resetButtonText: {
    color: '#333333',
    fontSize: scaleSize(30),
  },
  confirmButton: {
    backgroundColor: '#508EFF',
    borderRadius: scaleSize(30),
    paddingVertical: scaleSize(9),
    paddingHorizontal: scaleSize(50),
  },
  confirmButtonText: {
    color: colorWhite,
    fontSize: scaleSize(30),
  },
  buttons: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    flexDirection: 'row',
    paddingHorizontal: scaleSize(30),
  },
  queryContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: scaleSize(100),
    marginHorizontal: scaleSize(30),
    paddingVertical: scaleSize(19),
  },
});

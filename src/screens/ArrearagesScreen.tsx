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
import { colorWhite } from '../styles';
import { scaleSize } from 'react-native-responsive-design';
import {
  MeterReaderDto,
  PdaArrearageDto,
  PdaArrearageInputDto,
  PdaMeterBookDto,
} from '../../apiclient/src/models';
import center from '../data';
import { Toast, Modal as AntModal, DatePicker } from '@ant-design/react-native';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import SearchBox from '../components/SearchBox';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import ArrearageItem from '../components/ArrearageItem';
import dayjs from 'dayjs';
import Modal from 'react-native-smart-modal';

const PAGE_SIZE = 30;

export default function ArrearagesScreen() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const defaultBillMonth = parseInt(dayjs().format('YYYYMM'), 10);
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState<PdaArrearageDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState<PdaArrearageInputDto>({
    maxResultCount: PAGE_SIZE,
    beginMonth: defaultBillMonth,
    endMonth: defaultBillMonth,
  });
  const [snapshot, setSnapshot] = useState<PdaArrearageInputDto>({
    maxResultCount: PAGE_SIZE,
    beginMonth: defaultBillMonth,
    endMonth: defaultBillMonth,
  });
  const [pdaUsers, setPdaUsers] = useState<MeterReaderDto[]>([]);
  const [currentUser, setCurrentUser] = useState<MeterReaderDto>();
  const [books, setBooks] = useState<PdaMeterBookDto[]>([]);
  const [currentBook, setCurrentBook] = useState<PdaMeterBookDto>();

  const [settingsModalVisible, setSettingsModalVisible] = useState(false);
  const fRef = React.useRef<FlatList>(null);

  const fetchPdaUsers = async () => {
    try {
      const users = await center.getAllPdaUsers();
      setPdaUsers(users);
      if (users.length > 0) {
        setCurrentUser(users[0]);
      }
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await center.online.getBookList();
      setBooks(data);
      if (data.length > 0) {
        setCurrentBook(data[0]);
      }
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  useEffect(() => {
    fetchPdaUsers();
    fetchBooks();
  }, []);

  const refresh = async () => {
    setSettingsModalVisible(false);
    if (loading) {
      return;
    }

    const ps = params;
    ps.skipCount = 0;
    ps.maxResultCount = PAGE_SIZE;

    setLoading(true);
    try {
      const res = await center.getArrearageList(ps);
      setItems(res.items);
      setTotal(res.totalCount);
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
      const res = await center.getArrearageList(ps);
      setItems([...items, ...res.items]);
      setTotal(res.totalCount);
      setParams(ps);
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  const pickPdaUser = async () => {
    setSettingsModalVisible(false);
    const ops = pdaUsers?.map((item) => {
      return {
        text: item.name,
        onPress: () => {
          setCurrentUser(item);
          setSettingsModalVisible(true);
        },
      };
    });
    AntModal.operation(ops || []);
  };

  const pickBook = async () => {
    setSettingsModalVisible(false);
    const ops = books?.map((item) => {
      return {
        text: item.bookName,
        onPress: () => {
          setCurrentBook(item);
          setSettingsModalVisible(true);
        },
      };
    });
    AntModal.operation(ops || []);
  };

  const onStartPick = (dt: Date) => {
    const value = parseInt(dayjs(dt).format('YYYYMM'), 10);
    console.log('onPickBillMonth', value);
    setParams({ ...params, beginMonth: value });
  };

  const onEndPick = (dt: Date) => {
    const value = parseInt(dayjs(dt).format('YYYYMM'), 10);
    console.log('onPickBillMonth', value);
    setParams({ ...params, endMonth: value });
  };

  const resetQueryParams = async () => {
    setParams({ ...snapshot });
    if (pdaUsers.length > 0) {
      setCurrentUser(pdaUsers[0]);
    }
    if (books?.length > 0) {
      setCurrentBook(books[0]);
    }
  };

  const saveSnapshot = async () => {};

  const getItemLayout = (
    data: PdaArrearageDto[] | null | undefined,
    index: number,
  ) => ({
    length: scaleSize(439 + 18),
    offset: scaleSize(439 + 18) * index,
    index,
  });

  const findIndex = (data: PdaArrearageDto[], text: string) => {
    return data.findIndex(
      (it) =>
        (it.custName || '').indexOf(text) > -1 ||
        (it.custCode?.toString() || '').indexOf(text) > -1 ||
        (it.custAddress || '').indexOf(text) > -1,
    );
  };

  const onSearch = (text: string) => {
    const index = findIndex(items, text);
    if (index > -1) {
      fRef.current?.scrollToIndex({ animated: true, index });
    }
  };

  const renderSettingsModal = () => {
    return (
      <Modal
        visible={settingsModalVisible}
        fullScreen
        horizontalLayout="right"
        animationIn="slideInRight"
        animationOut="slideOutRight"
        onChange={setSettingsModalVisible}>
        <View style={styles.settingsModalContent}>
          <View style={styles.settings}>
            <View style={styles.settingsTop}>
              <Image
                style={styles.settingsIcon}
                source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_screen2_normal.png')}
              />
              <Text style={styles.settingsTitle}>筛选</Text>
            </View>

            <View style={styles.settingsContent}>
              <Text style={styles.settingsSubTitle}>抄表员</Text>
              <TouchableOpacity
                style={styles.settingsInput}
                onPress={pickPdaUser}>
                <Image
                  style={styles.settingsInputIconUser}
                  source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_user_normal.png')}
                />
                <Text style={styles.settingsInputText}>
                  {currentUser?.name}
                </Text>
                <Image
                  style={styles.settingsInputIcon}
                  source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
                />
              </TouchableOpacity>
              <Text style={styles.settingsSubTitle}>册本</Text>
              <TouchableOpacity style={styles.settingsInput} onPress={pickBook}>
                <Image
                  style={styles.settingsInputIconUser}
                  source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_user_normal.png')}
                />
                <Text style={styles.settingsInputText}>
                  {currentBook?.bookName}
                </Text>
                <Image
                  style={styles.settingsInputIcon}
                  source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
                />
              </TouchableOpacity>
              <Text style={styles.settingsSubTitle}>财务年月</Text>
              <View style={styles.settingsDatePickers}>
                <DatePicker
                  value={dayjs(params.beginMonth.toString(), 'YYYYMM').toDate()}
                  mode="month"
                  defaultDate={new Date()}
                  minDate={new Date(2015, 7, 6)}
                  maxDate={new Date()}
                  onChange={onStartPick}
                  format="YYYY-MM">
                  <TouchableOpacity
                    style={[styles.settingsInput, { width: scaleSize(196) }]}>
                    <Text style={styles.settingsInputText}>
                      {params.beginMonth}
                    </Text>
                    <Image
                      style={styles.settingsInputIcon}
                      source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
                    />
                  </TouchableOpacity>
                </DatePicker>
                <Text>至</Text>
                <DatePicker
                  value={dayjs(params.endMonth.toString(), 'YYYYMM').toDate()}
                  mode="month"
                  defaultDate={new Date()}
                  minDate={new Date(2015, 7, 6)}
                  maxDate={new Date()}
                  onChange={onEndPick}
                  format="YYYY-MM">
                  <TouchableOpacity
                    style={[styles.settingsInput, { width: scaleSize(196) }]}>
                    <Text style={styles.settingsInputText}>
                      {params.endMonth}
                    </Text>
                    <Image
                      style={styles.settingsInputIcon}
                      source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
                    />
                  </TouchableOpacity>
                </DatePicker>
              </View>
            </View>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetQueryParams}>
              <Text style={styles.resetButtonText}>重置</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.confirmButton} onPress={refresh}>
              <Text style={styles.confirmButtonText}>确定</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const renderItem = (info: ListRenderItemInfo<PdaArrearageDto>) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('Payment', {
            custId: info.item.custId,
            custCode: info.item.custCode,
          })
        }>
        <ArrearageItem data={info.item} />
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
        style={[styles.topContainer, { paddingTop: scaleSize(60) }]}>
        <CommonTitleBarEx
          onBack={() => navigation.goBack()}
          onRight2Click={() => {
            saveSnapshot();
            setSettingsModalVisible(true);
          }}
          right1Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
          onRight1Click={() => refresh()}
          right2Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_adjustment_normal.png')}
          title={'欠费查询'}
          titleColor={colorWhite}
        />
        <SearchBox
          style={styles.searchContainer}
          placeholderTextColor={colorWhite}
          onSearch={onSearch}
        />
      </LinearGradient>

      <FlatList<PdaArrearageDto>
        ref={fRef}
        style={styles.items}
        initialNumToRender={10}
        data={items}
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
        getItemLayout={getItemLayout}
      />

      {renderSettingsModal()}
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
  topBox: {
    backgroundColor: colorWhite,
    borderRadius: scaleSize(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: scaleSize(30),
    paddingVertical: scaleSize(24),
  },
  topItem: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topItemLabel: {
    color: '#666666',
    fontSize: scaleSize(34),
  },
  topItemValue: {
    color: '#333333',
    fontSize: scaleSize(44),
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
    fontSize: scaleSize(28),
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
    fontSize: scaleSize(34),
    color: '#333333',
    marginTop: scaleSize(39),
    marginBottom: scaleSize(12),
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
    paddingHorizontal: scaleSize(25),
    paddingVertical: scaleSize(18),
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
});

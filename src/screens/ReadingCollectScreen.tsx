import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import center from '../data';
import { DatePicker, Provider, Toast } from '@ant-design/react-native';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import {
  MeterReaderDto,
  PdaReadingCollectDto,
} from '../../apiclient/src/models';
import dayjs from 'dayjs';
import { sum } from '../utils/sumUtils';
import ReadingCollectItem from '../components/ReadingCollectItem';
import Modal from 'react-native-smart-modal';
import { Modal as AntModal } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/core';

export default function ReadingCollectScreen() {
  const navigation = useNavigation();

  const [items, setItems] = useState<PdaReadingCollectDto[]>();
  const [loading, setLoading] = useState(false);
  const [pdaUsers, setPdaUsers] = useState<MeterReaderDto[]>([]);
  const [currentUser, setCurrentUser] = useState<MeterReaderDto>();

  const defaultBillMonth = parseInt(dayjs().format('YYYYMM'), 10);
  const [billMonth, setBillMonth] = useState<number>(defaultBillMonth);
  const [settingsModalVisible, setSettingsModalVisible] = useState(false);

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

  useEffect(() => {
    fetchPdaUsers();
  }, []);

  const fetchRemote = async () => {
    if (loading) {
      return;
    }
    const key = Toast.loading('加载中');
    try {
      const result = await center.getReadingCollect(currentUser?.id, billMonth);
      setItems(result);
      Toast.remove(key);
    } catch (e) {
      Toast.fail(e.message);
      setLoading(false);
      Toast.remove(key);
    } finally {
      setLoading(false);
      Toast.remove(key);
    }
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaReadingCollectDto>) => {
    return <ReadingCollectItem data={info.item} />;
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

  const onPickBillMonth = (dt: Date) => {
    const value = parseInt(dayjs(dt).format('YYYYMM'), 10);
    console.log('onPickBillMonth', value);
    setBillMonth(value);
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
              <Text style={styles.settingsSubTitle}>抄表年月</Text>
              <View style={styles.settingsDatePickers}>
                <DatePicker
                  value={dayjs(billMonth, 'YYYYMM').toDate()}
                  mode="month"
                  defaultDate={new Date()}
                  minDate={new Date(2015, 7, 6)}
                  maxDate={new Date(2026, 11, 3)}
                  onChange={onPickBillMonth}
                  format="MM">
                  <TouchableOpacity
                    style={[styles.settingsInput, { width: scaleSize(450) }]}>
                    <Text style={styles.settingsInputText}>{billMonth}</Text>
                    <Image
                      style={styles.settingsInputIcon}
                      source={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_down_normal.png')}
                    />
                  </TouchableOpacity>
                </DatePicker>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <Provider>
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
              onRight1Click={fetchRemote}
              right2Icon={require('../assets/qietu/qianfeichaxxun/arrearage_inquiry_icon_screen_normal.png')}
              title="抄表统计"
              titleColor={colorWhite}
              onRight2Click={() => setSettingsModalVisible(true)}
              right1Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
            />
            <View style={styles.topBox}>
              <View style={styles.topItem}>
                <Text style={styles.topItemValue}>
                  {sum(items?.map((it) => it.expectRead) || [])}
                </Text>
                <Text style={styles.topItemLabel}>应抄</Text>
              </View>
              <View style={styles.topItem}>
                <Text style={styles.topItemValue}>
                  {sum(items?.map((it) => it.actualRead) || [])}
                </Text>
                <Text style={styles.topItemLabel}>实抄</Text>
              </View>
              <View style={styles.topItem}>
                <Text style={styles.topItemValue}>
                  {sum(items?.map((it) => it.totalWater) || [])}
                </Text>
                <Text style={styles.topItemLabel}>水量</Text>
              </View>
              <View style={styles.topItem}>
                <Text style={styles.topItemValue}>
                  {sum(items?.map((it) => it.totalMoney) || [])}
                </Text>
                <Text style={styles.topItemLabel}>金额</Text>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <FlatList<PdaReadingCollectDto>
          style={styles.items}
          data={items}
          renderItem={renderBookItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: scaleSize(18) }} />
          )}
          keyExtractor={(item) => item.bookCode.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
          }}
        />

        {renderSettingsModal()}
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  topContainer: {
    height: scaleSize(210),
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
    marginTop: scaleSize(100),
  },
  item: {
    paddingHorizontal: scaleSize(30),
    // marginTop: scaleSize(18),
    backgroundColor: '#F9F9F9',
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
  loading: {
    position: 'absolute',
    zIndex: 9999,
    right: scaleSize(30),
    bottom: scaleSize(314),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  loadingIcon: {
    width: scaleSize(88),
    height: scaleSize(92),
  },
  loadingTitle: {
    color: '#2484E8',
    fontSize: scaleSize(14),
    marginTop: scaleSize(-15),
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
});

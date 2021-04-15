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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleHeight, scaleSize } from 'react-native-responsive-design';
import BookItem from '../components/BookItem';
import center from '../data';
import { Modal as AntModal, Toast } from '@ant-design/react-native';
import { PdaMeterBookDtoHolder } from '../data/holders';
import CircleCheckBox from '../components/CircleCheckBox';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import SwipeButton from '../components/SwipeButton';
import db from '../data/database';
import {
  AttachmentDbItem,
  BookAttachmentsTotal,
  NumbersType,
} from '../data/models';
import { getBillMonth, saveBillMonth } from '../utils/billMonthUtils';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import Modal from 'react-native-smart-modal';
import { ReadingDataDto, ReadingMonthDto } from '../../apiclient/src/models';
import DeviceInfo from 'react-native-device-info';
import { l } from '../utils/logUtils';
import { uploadAttachments } from '../utils/attachUtils';
import { getSession, UserSession } from '../utils/sesstionUtils';
import dayjs from 'dayjs';
import {
  getNewReadSetting,
  NewReadSetting,
} from '../utils/newReadSettingUtils';

export default function BooksScreen() {
  const navigation = useNavigation();

  const [bookItems, setBookItems] = useState<PdaMeterBookDtoHolder[]>([]);
  const [totalNumbers, setTotalNumbers] = useState<NumbersType>({
    readingNumber: 0,
    totalNumber: 0,
    uploadedNumber: 0,
  });
  const [loading, setLoading] = useState(false);
  const [currentBillMonth, setCurrentBillMonth] = useState<ReadingMonthDto>();
  const [currentBook, setCurrentBook] = useState<PdaMeterBookDtoHolder>();
  const [modalVisible, setModalVisible] = useState(false);
  const [
    bookAttachTotal,
    setBookAttachTotal,
  ] = useState<BookAttachmentsTotal>();
  const [readWater, setReadWater] = useState(0);
  const [userSession, setUserSession] = useState<UserSession>();
  const [readSetting, setReadSetting] = useState<NewReadSetting>({
    alert: true,
    vibrate: true,
  });

  useEffect(() => {
    const fetchEL = async () => {
      let us = userSession;
      if (!us) {
        us = (await getSession()) || undefined;
      }
      db.getBookTotalData(us?.userInfo.id).then((result) => {
        setTotalNumbers(result);
      });
      getBillMonth(us?.userInfo.id).then((r) => {
        if (r) {
          setCurrentBillMonth(r);
        } else {
          center.getReadingMonth().then((res) => {
            if (res) {
              setCurrentBillMonth(res);
              saveBillMonth(res, us?.userInfo.id);
            }
          });
        }
      });
    };
    fetchEL();
    fetchReadSetting();
  }, []);

  const fetchLocal = React.useCallback(async () => {
    try {
      let us = userSession;
      if (!us) {
        us = (await getSession()) || undefined;
        setUserSession(us);
      }
      const res = await center.offline.getBookList(us?.userInfo.id);
      const items = (res as PdaMeterBookDtoHolder[]).map((value) => {
        value.checked = false;
        return value;
      });
      setBookItems(items);
      await fetchTotalNumbers();
    } catch (e) {
      Toast.fail(e.message);
    }
  }, []);

  // useEffect(() => {
  //   fetchLocal();
  // }, [fetchLocal]);

  const fetchTotalNumbers = async () => {
    let us = userSession;
    if (!us) {
      us = (await getSession()) || undefined;
      setUserSession(us);
    }
    const result = await db.getBookTotalData(us?.userInfo.id);
    setTotalNumbers(result);
  };

  const fetchReadSetting = async () => {
    const setting = await getNewReadSetting();
    if (setting) {
      setReadSetting(setting);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchLocal();
    }, [fetchLocal]),
  );

  const bookItemCheckClick = (holder: PdaMeterBookDtoHolder) => {
    bookItems.forEach((item) => {
      if (item.bookId === holder.bookId) {
        item.checked = !item.checked;
      }
    });
    setBookItems([...bookItems]);
  };

  const bookItemClick = (holder: PdaMeterBookDtoHolder) => {
    if (holder.downloaded) {
      if (dayjs().isAfter(dayjs(currentBillMonth?.endDate))) {
        AntModal.alert('提示', '当前时间无法抄表，请下载最新数据', [
          {
            text: '取消',
            onPress: () => console.log('取消'),
            style: { color: '#666666' },
          },
          {
            text: '确认下载',
            onPress: async () => {
              refresh();
            },
          },
        ]);
      } else {
        navigation.navigate('BookTask', {
          bookId: holder.bookId,
          title: holder.bookCode,
          setting: readSetting,
        });
      }
    } else {
      AntModal.alert('提示', '当前任务未下载，是否立刻下载', [
        {
          text: '取消',
          onPress: () => console.log('取消'),
          style: { color: '#666666' },
        },
        {
          text: '确认下载',
          onPress: async () => {
            downloadByBookId(holder.bookId);
          },
        },
      ]);
    }
  };

  const allBooksClick = () => {
    const allChecked = !bookItems
      .filter((it) => !it.downloaded)
      .find((item) => item.checked === false);
    bookItems.forEach((item) => {
      if (!item.downloaded) {
        item.checked = !allChecked;
      }
    });
    setBookItems([...bookItems]);
  };

  const fetchRemoteBooks = async () => {
    try {
      let us = userSession;
      if (!us) {
        us = (await getSession()) || undefined;
      }
      await center.getBookList(us?.userInfo.id);
      await fetchLocal();
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  const uploadReadingData = async () => {
    const ids = bookItems.filter((it) => it.downloaded).map((it) => it.bookId);
    l.info(`准备上传bookId为(${ids.join(',')})的抄表数据`);
    const readingDatas = await db.getToUploadBookDatas();
    l.info(`准备上传抄表数据 ${readingDatas.length} 条`, readingDatas);
    const inputItems = readingDatas.map((it) => {
      const item: ReadingDataDto = {
        billMonth: it.billMonth,
        custId: it.custId,
        readTimes: it.readTimes,
        reading: it.reading,
        childReading: it.childReading,
        readWater: it.readWater,
        readDate: it.readDate,
        readStateId: it.readStateId,
        highLowState: it.highLowState,
        isEstimate: it.isEstimate,
        readRemark: it.readRemark,
      };
      return item;
    });
    await center.uploadReadingData({
      deviceCode: DeviceInfo.getUniqueId(),
      readingDates: inputItems,
    });
    await db.markBookUploaded(ids, inputItems);
  };

  const sync = async () => {
    try {
      await fetchRemoteBooks();
      await center.sync(DeviceInfo.getUniqueId());
      const attachments = await db.getToUploadAttachments();
      const map = new Map<string, AttachmentDbItem[]>();
      attachments.forEach((it) => {
        const key = `${it.billMonth}${it.custId}${it.readTimes}`;
        if (!map.has(key)) {
          map.set(key, []);
        }
        const items = map.get(key);
        items?.push(it);
      });
      const ps: Promise<any>[] = [];
      map.forEach((values) => {
        if (values[0].custId && values[0].billMonth && values[0].readTimes) {
          const p = uploadAttachments(
            values[0].custId,
            values[0].billMonth,
            values[0].readTimes,
            values,
          );
          ps.push(p);
        }
      });
      l.info(`正在等待所有附件上传完成, 共 ${attachments.length} 个`);
      await Promise.all(ps);
      l.info(`所有附件已经上传完成, 共 ${attachments.length} 个`);

      await fetchLocal();
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  const refresh = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const billMonthResult = await center.getReadingMonth();
      const billMonthLocal = await getBillMonth(userSession?.userInfo.id);
      console.log('billMonthLocal', billMonthLocal);
      if (!billMonthLocal || !billMonthLocal.billingMonth) {
        await uploadReadingData();
        await sync();
      } else if (
        billMonthLocal.billingMonth !== billMonthResult?.billingMonth
      ) {
        AntModal.alert(
          '提示',
          '当前抄表周期与手机内不一致，是否清除不一致数据？',
          [
            {
              text: '取消',
              onPress: () => console.log('cancel'),
              style: 'cancel',
            },
            {
              text: '确认',
              onPress: async () => {
                if (billMonthResult) {
                  setCurrentBillMonth(billMonthResult);
                  await saveBillMonth(
                    billMonthResult,
                    userSession?.userInfo.id,
                  );
                }
                await uploadReadingData();
                let us = userSession;
                if (!us) {
                  us = (await getSession()) || undefined;
                }
                await db.deleteBooks(us?.userInfo.id);
                await sync();
              },
            },
          ],
        );
      } else {
        await uploadReadingData();
        await sync();
      }
    } catch (e) {
      Toast.fail(e.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const downloadByBookId = async (bookId: number) => {
    setLoading(true);
    try {
      await center.getBookDataByIds([bookId]);
      fetchLocal();
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      setLoading(false);
    }
  };

  const download = async () => {
    const checkedItems = bookItems
      .filter((value) => value.checked)
      .map((it) => it.bookId);
    if (checkedItems.length === 0) {
      return;
    }
    setLoading(true);
    try {
      await center.getBookDataByIds(checkedItems);
      fetchLocal();
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      setLoading(false);
    }
  };

  const openAna = (rowMap: RowMap<PdaMeterBookDtoHolder>, rowKey: number) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
    setModalVisible(true);
    db.getAttachmentsTotalByBookId(rowKey).then((r) => setBookAttachTotal(r));
    db.getReadWaterTotalByBookId(rowKey).then((r) => setReadWater(r));
  };

  const deleteItem = async (
    rowMap: RowMap<PdaMeterBookDtoHolder>,
    rowKey: number,
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      const find = bookItems.find((it) => it.bookId === rowKey);
      if (find && find.readingNumber > 0 && find.downloaded) {
        AntModal.alert('提示', '当前册本已开始抄表，不允许删除', [
          {
            text: '确定',
            style: { color: '#666666' },
          },
        ]);
      } else {
        AntModal.alert('提示', '是否确认删除？', [
          {
            text: '取消',
            style: { color: '#666666' },
          },
          {
            text: '确认删除',
            style: { color: 'red' },
            onPress: async () => {
              await db.deleteBookById(rowKey);
              Toast.success('删除成功');
              await fetchLocal();
            },
          },
        ]);
      }
    }
  };

  const renderAnaModal = () => {
    return (
      <Modal
        visible={modalVisible}
        fullScreen
        horizontalLayout="right"
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={{ justifyContent: 'center', alignItems: 'center' }}
        onChange={setModalVisible}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}>
            <Image
              style={styles.modalCloseImage}
              source={require('../assets/qietu/chaobiaoluru/enter_icon_idelete2_normal.png')}
            />
          </TouchableOpacity>

          <Text style={styles.modalTitle}>册本数据统计</Text>
          <View style={styles.modalLineMain} />
          <View style={styles.modalLineSub} />
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>应抄：</Text>
              <Text style={styles.modalValue}>{currentBook?.totalNumber}</Text>
            </View>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>已抄：</Text>
              <Text style={styles.modalValue}>
                {currentBook?.readingNumber}
              </Text>
            </View>
          </View>
          <View style={{ height: scaleSize(24) }} />
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>已上传：</Text>
              <Text style={styles.modalValue}>
                {currentBook?.uploadedNumber || 0}
              </Text>
            </View>
            <View style={styles.modalCol} />
          </View>
          <View style={styles.modalLine} />
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>附件：</Text>
              <Text style={styles.modalValue}>
                {bookAttachTotal?.total || 0}
              </Text>
            </View>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>上传附件：</Text>
              <Text style={styles.modalValue}>
                {bookAttachTotal?.uploaded || 0}
              </Text>
            </View>
          </View>
          <View style={styles.modalLine} />
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>抄见水量：</Text>
              <Text style={styles.modalValue}>{readWater}</Text>
            </View>
            <View style={styles.modalCol} />
          </View>
        </View>
      </Modal>
    );
  };

  const renderLoadingModal = () => {
    return (
      <Modal
        visible={loading}
        fullScreen
        animationIn="zoomIn"
        animationOut="zoomOut"
        maskCloseable={false}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
          marginTop: 100,
          paddingTop: 100,
        }}
        verticalLayout="bottom"
        onChange={setLoading}>
        <View style={styles.loading}>
          <Image
            style={styles.loadingIcon}
            source={require('../assets/qietu/chaobiaorenwu/meter_reading_task_picture_normal.png')}
          />
          <Text style={styles.loadingTitle}>数据下载中</Text>
        </View>
      </Modal>
    );
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaMeterBookDtoHolder>) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.item}
        onPress={() => bookItemClick(info.item)}>
        <BookItem
          holder={info.item}
          onCheckClick={() => bookItemCheckClick(info.item)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderLoadingModal()}
      {renderAnaModal()}

      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={['#4888E3', '#2567E5']}
        style={styles.topContainer}>
        <SafeAreaView edges={['top']}>
          <CommonTitleBarEx
            onBack={() => navigation.goBack()}
            onRight2Click={refresh}
            title={`抄表任务(${currentBillMonth?.billingMonth || ''})`}
            titleColor={colorWhite}
            right2Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
          />
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.topBox}>
        <View style={styles.topItem}>
          <Text style={styles.topItemValue}>{totalNumbers?.totalNumber}</Text>
          <Text style={styles.topItemLabel}>应抄</Text>
        </View>
        <View style={styles.topItem}>
          <Text style={styles.topItemValue}>{totalNumbers?.readingNumber}</Text>
          <Text style={styles.topItemLabel}>已抄</Text>
        </View>
        <View style={styles.topItem}>
          <Text style={styles.topItemValue}>
            {totalNumbers?.uploadedNumber}
          </Text>
          <Text style={styles.topItemLabel}>已上传</Text>
        </View>
      </View>

      <SwipeListView<PdaMeterBookDtoHolder>
        style={styles.items}
        data={bookItems}
        renderItem={renderBookItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleSize(18) }} />
        )}
        closeOnRowPress={true}
        closeOnRowBeginSwipe={true}
        closeOnScroll={true}
        swipeToOpenPercent={30}
        disableRightSwipe
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowHidden}>
            <SwipeButton
              style={styles.rowHiddenStatic}
              title="统计"
              onClick={() => {
                setCurrentBook(data.item);
                openAna(rowMap, data.item.bookId);
              }}
              icon={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_statistics_normal.png')}
            />
            <SwipeButton
              style={styles.rowHiddenDelete}
              title="删除"
              onClick={() => deleteItem(rowMap, data.item.bookId)}
              icon={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_delete_normal.png')}
            />
          </View>
        )}
        leftOpenValue={scaleSize(240)}
        rightOpenValue={scaleSize(-240)}
        keyExtractor={(item) => item.bookId.toString()}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
          paddingTop: scaleSize(18),
        }}
      />
      <SafeAreaView edges={['bottom']} style={styles.bottomContainer}>
        <CircleCheckBox
          title="全选"
          iconStyle={{ width: scaleSize(38), height: scaleSize(38) }}
          onClick={allBooksClick}
          checked={
            bookItems.filter((it) => !it.downloaded).length > 0 &&
            !bookItems
              .filter((it) => !it.downloaded)
              .find((item) => item.checked === false)
          }
        />

        <View style={styles.bottomRight}>
          <Text style={styles.bottomLabel}>
            已选册本(
            {bookItems.filter((item) => item.checked === true).length})
          </Text>
          <TouchableOpacity style={styles.btnDone} onPress={download}>
            <Text style={styles.btnDoneText}>下载</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#F9F9F9',
  },
  topContainer: {
    // height: scaleSize(210),
    paddingBottom: scaleSize(80),
  },
  topBox: {
    backgroundColor: colorWhite,
    borderRadius: scaleSize(4),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: scaleSize(30),
    paddingVertical: scaleSize(24),
    zIndex: 1000,
    overflow: 'visible',
    marginTop: scaleSize(-60),
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
    // marginTop: scaleSize(110),
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
    borderTopColor: '#F9F9F9',
    borderTopWidth: scaleSize(1),
  },
  bottomLabel: {
    color: '#5598F4',
    fontSize: scaleSize(28),
    marginEnd: scaleSize(24),
  },
  btnDone: {
    backgroundColor: '#096BF3',
    paddingVertical: scaleSize(10),
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
    height: scaleSize(150),
  },
  rowHiddenDelete: {
    backgroundColor: '#F0655A',
    height: scaleSize(150),
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
    width: scaleHeight(150),
    height: scaleHeight(180),
  },
  loadingTitle: {
    color: '#2484E8',
    fontSize: scaleSize(30),
    marginTop: scaleSize(-15),
  },
  modalContainer: {
    backgroundColor: colorWhite,
    borderRadius: scaleSize(8),
    width: scaleSize(580),
    height: scaleSize(532),
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    right: 0,
    top: 0,
    paddingStart: scaleSize(15),
    paddingBottom: scaleSize(15),
  },
  modalCloseImage: {
    width: scaleSize(50),
    height: scaleSize(50),
  },
  modalTitle: {
    fontSize: scaleSize(34),
    color: '#333333',
    fontWeight: 'bold',
    marginHorizontal: scaleSize(40),
    marginTop: scaleSize(40),
    marginBottom: scaleSize(10),
  },
  modalLineMain: {
    backgroundColor: '#6F9DFC',
    height: scaleSize(4),
    marginHorizontal: scaleSize(34),
  },
  modalLineSub: {
    backgroundColor: '#CCDCFF',
    height: scaleSize(2),
    marginTop: scaleSize(4),
    marginHorizontal: scaleSize(34),
    marginBottom: scaleSize(40),
  },
  modalRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: scaleSize(34),
  },
  modalCol: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  modalLabel: {
    color: '#999999',
    fontSize: scaleSize(30),
  },
  modalValue: {
    color: '#333333',
    fontWeight: 'bold',
    fontSize: scaleSize(30),
  },
  modalLine: {
    backgroundColor: '#DEDEDE',
    height: scaleSize(1),
    marginVertical: scaleSize(30),
    marginHorizontal: scaleSize(30),
  },
});

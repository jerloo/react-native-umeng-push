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
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import BookItem from '../components/BookItem';
import center from '../data';
import { Modal as AntModal, Toast } from '@ant-design/react-native';
import { PdaMeterBookDtoHolder } from '../data/holders';
import CircleCheckBox from '../components/CircleCheckBox';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import SwipeButton from '../components/SwipeButton';
import db from '../data/database';
import { NumbersType } from '../data/models';
import { getBillMonth } from '../utils/billMonthUtils';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import { useNavigation } from '@react-navigation/core';
import Modal from 'react-native-smart-modal';

export default function BooksScreen() {
  const navigation = useNavigation();

  const [bookItems, setBookItems] = useState<PdaMeterBookDtoHolder[]>([]);
  const [totalNumbers, setTotalNumbers] = useState<NumbersType>({
    readingNumber: 0,
    totalNumber: 0,
    uploadedNumber: 0,
  });
  const [loading, setLoading] = useState(false);
  const [currentBillMonth, setCurrentBillMonth] = useState<number>();
  const [currentBook, setCurrentBook] = useState<PdaMeterBookDtoHolder>();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    db.getBookTotalData().then((result) => {
      setTotalNumbers(result);
    });
    getBillMonth().then((r) => {
      if (r) {
        setCurrentBillMonth(r);
      }
    });
  }, []);

  const fetchLocal = async () => {
    try {
      const res = await center.offline.getBookList();
      const items = (res as PdaMeterBookDtoHolder[]).map((value) => {
        value.checked = false;
        return value;
      });
      setBookItems(items);
    } catch (e) {
      Toast.fail(e.message);
    }
  };

  useEffect(() => {
    fetchLocal();
  }, []);

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
      navigation.navigate('BookTask', {
        bookId: holder.bookId,
        title: holder.bookCode,
      });
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
    const allChecked = !bookItems.find((item) => item.checked === false);
    bookItems.forEach((item) => {
      item.checked = !allChecked;
    });
    setBookItems([...bookItems]);
  };

  const fetchRemote = async () => {
    try {
      const booksResult = await center.getBookList();
      const items = (booksResult as PdaMeterBookDtoHolder[]).map((value) => {
        value.checked = false;
        return value;
      });
      setBookItems(items);
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
      const billMonthLocal = await getBillMonth();
      if (!billMonthLocal) {
        await fetchRemote();
      } else if (billMonthLocal !== billMonthResult) {
        AntModal.alert(
          '提示',
          '当前抄表周期与手机内不一致，是否清楚不一致数据？',
          [
            {
              text: '取消',
              onPress: () => console.log('cancel'),
              style: 'cancel',
            },
            {
              text: '确认',
              onPress: async () => {
                await db.deleteBooks();
                await fetchRemote();
              },
            },
          ],
        );
      } else {
        await fetchRemote();
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
    setLoading(true);
    try {
      await center.getBookDataByIds(
        bookItems.filter((value) => value.checked).map((it) => it.bookId),
      );
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
  };

  const deleteItem = async (
    rowMap: RowMap<PdaMeterBookDtoHolder>,
    rowKey: number,
  ) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      await db.deleteBookById(rowKey);
      fetchLocal();
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
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>已上传：</Text>
              <Text style={styles.modalValue}>{currentBook?.totalNumber}</Text>
            </View>
            <View style={styles.modalCol} />
          </View>
          <View style={styles.modalLine} />
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>附件：</Text>
              <Text style={styles.modalValue}>{currentBook?.totalNumber}</Text>
            </View>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>上传附件：</Text>
              <Text style={styles.modalValue}>
                {currentBook?.readingNumber}
              </Text>
            </View>
          </View>
          <View style={styles.modalLine} />
          <View style={styles.modalRow}>
            <View style={styles.modalCol}>
              <Text style={styles.modalLabel}>抄见水量：</Text>
              <Text style={styles.modalValue}>
                {currentBook?.readingNumber}
              </Text>
            </View>
            <View style={styles.modalCol} />
          </View>
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
            title={`抄表任务(${currentBillMonth || ''})`}
            titleColor={colorWhite}
            right2Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
          />
          <View style={styles.topBox}>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>
                {totalNumbers?.totalNumber}
              </Text>
              <Text style={styles.topItemLabel}>应抄</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>
                {totalNumbers?.readingNumber}
              </Text>
              <Text style={styles.topItemLabel}>已抄</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>
                {totalNumbers?.uploadedNumber}
              </Text>
              <Text style={styles.topItemLabel}>已上传</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

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
        }}
      />

      <View style={styles.bottomContainer}>
        <CircleCheckBox
          title="全选"
          iconStyle={{ width: scaleSize(38), height: scaleSize(38) }}
          onClick={allBooksClick}
          checked={!bookItems.find((item) => item.checked === false)}
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
      </View>

      {loading ? (
        <View style={styles.loading}>
          <Image
            style={styles.loadingIcon}
            source={require('../assets/qietu/chaobiaorenwu/meter_reading_task_picture_normal.png')}
          />
          <Text style={styles.loadingTitle}>数据下载中</Text>
        </View>
      ) : null}
      {renderAnaModal()}
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
    marginTop: scaleSize(110),
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
  modalContainer: {
    backgroundColor: colorWhite,
    borderRadius: scaleSize(8),
    width: scaleSize(580),
    height: scaleSize(532),
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

import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import { getSession, UserSession } from '../utils/sesstionUtils';
import BooksBackTitleBar from '../components/BooksBackTitleBar';
import BookItem from '../components/BookItem';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import { PdaMeterBookDtoHolder } from '../data/holders';
import CircleCheckBox from '../components/CircleCheckBox';
import { SwipeListView } from 'react-native-swipe-list-view';
import SwipeButton from '../components/SwipeButton';

export default function BooksScreen({ navigation }: any) {
  const [session, setSession] = useState<UserSession>();
  const [bookItems, setBookItems] = useState<PdaMeterBookDtoHolder[]>([]);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s || undefined);
    });
  }, []);

  const fetchLocal = () => {
    center.offline.getBookList().then((res) => {
      if (res instanceof String) {
        Toast.fail(res as string);
      } else {
        const items = (res as PdaMeterBookDtoHolder[]).map((value) => {
          value.checked = false;
          return value;
        });
        setBookItems(items);
      }
    });
  };

  useEffect(() => {
    fetchLocal();
  }, []);

  const bookItemCheckClick = (holder: PdaMeterBookDtoHolder) => {
    bookItems.forEach((item) => {
      if (item.bookId === holder.bookId) {
        item.checked = !item.checked;
        console.log('更改状态', item);
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
    }
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaMeterBookDtoHolder>) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.item}
        onPress={() => bookItemClick(info.item)}>
        <BookItem
          key={info.item.bookId}
          holder={info.item}
          onCheckClick={() => bookItemCheckClick(info.item)}
        />
      </TouchableOpacity>
    );
  };

  const allBooksClick = () => {
    const allChecked = !bookItems.find((item) => item.checked === false);
    bookItems.forEach((item) => {
      item.checked = !allChecked;
    });
    setBookItems([...bookItems]);
  };

  const refresh = () => {
    center.getBookList().then((res) => {
      if (res instanceof String) {
        Toast.fail(res as string);
      } else {
        const items = (res as PdaMeterBookDtoHolder[]).map((value) => {
          value.checked = false;
          return value;
        });
        setBookItems(items);
      }
    });
  };

  const download = () => {
    center
      .getBookDataByIds(
        bookItems.filter((value) => value.checked).map((it) => it.bookId),
      )
      .then(() => {
        console.log('下载数据完成');
        fetchLocal();
      });
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
          <BooksBackTitleBar
            onBack={() => navigation.goBack()}
            onRightClick={refresh}
            title="抄表任务"
            titleColor={colorWhite}
          />
          <View style={styles.topBox}>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>12345</Text>
              <Text style={styles.topItemLabel}>应抄</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>12345</Text>
              <Text style={styles.topItemLabel}>已抄</Text>
            </View>
            <View style={styles.topItem}>
              <Text style={styles.topItemValue}>12345</Text>
              <Text style={styles.topItemLabel}>已上传</Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <SwipeListView<PdaMeterBookDtoHolder>
        style={styles.items}
        data={bookItems}
        renderItem={renderBookItem}
        disableLeftSwipe={true}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleSize(18) }} />
        )}
        renderHiddenItem={(_data, _rowMap) => (
          <View style={styles.rowHidden}>
            <SwipeButton
              style={styles.rowHiddenStatic}
              title="统计"
              icon={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_statistics_normal.png')}
            />
            <SwipeButton
              style={styles.rowHiddenDelete}
              title="删除"
              icon={require('../assets/qietu/chaobiaorenwu/meter_reading_task_icon_delete_normal.png')}
            />
          </View>
        )}
        leftOpenValue={scaleSize(-240)}
        rightOpenValue={scaleSize(240)}
        keyExtractor={(item) => item.bookCode.toString()}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
        }}
      />

      <View style={styles.bottomContainer}>
        <CircleCheckBox
          title="全选"
          onClick={allBooksClick}
          checked={!bookItems.find((item) => item.checked === false)}
        />
        <View style={styles.bottomRight}>
          <Text style={styles.bottomLabel}>
            已选测本(
            {bookItems.filter((item) => item.checked === true).length})
          </Text>
          <TouchableOpacity style={styles.btnDone} onPress={download}>
            <Text style={styles.btnDoneText}>下载</Text>
          </TouchableOpacity>
        </View>
      </View>
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
});

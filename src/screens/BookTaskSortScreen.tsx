import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import BooksBackTitleBar from '../components/titlebars/BooksBackTitleBar';
import { PdaReadDataDto } from '../../apiclient/src/models';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import BookSortItem from '../components/BookSortItem';
import { RowMap, SwipeListView } from 'react-native-swipe-list-view';
import { PdaReadDataDtoHolder } from '../data/holders';
import SwipeButton from '../components/SwipeButton';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';

export default function BookTaskSortScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'BookTaskSort'>>();
  const navigation = useNavigation();

  const [BookSortItems, setBookSortItems] = useState<PdaReadDataDtoHolder[]>(
    [],
  );

  useEffect(() => {
    const { bookId, title } = route.params;
    console.log(bookId, title);

    const fetchLocal = async () => {
      try {
        const res = await center.offline.getBookDataByIds([bookId]);
        const items = (res as PdaReadDataDto[]).map((value) => {
          const data: PdaReadDataDtoHolder = {
            item: value,
            showExtra: false,
          };
          return data;
        });
        setBookSortItems(items);
      } catch (e) {
        Toast.fail(e.message);
      }
    };

    fetchLocal();
  }, [route.params]);

  const renderBookItem = (info: ListRenderItemInfo<PdaReadDataDtoHolder>) => {
    return (
      <TouchableOpacity activeOpacity={1.0}>
        <BookSortItem
          showExtra={false}
          item={info.item.item}
          key={info.item.item.custId}
        />
      </TouchableOpacity>
    );
  };

  const onSearchButtonClick = () => {};

  const closeRow = (rowMap: RowMap<PdaReadDataDtoHolder>, rowKey: number) => {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
      console.log('关闭');
    }
  };

  const topRow = (rowMap: RowMap<PdaReadDataDtoHolder>, rowKey: number) => {
    closeRow(rowMap, rowKey);
    let newData = [...BookSortItems];
    newData.forEach((item) => {
      if (item.item.bookId === rowKey) {
        item.item.bookSortIndex = 1;
      }
    });
    newData = newData.sort((it) => it.item.bookSortIndex);
    setBookSortItems(newData);
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
            onRightClick={onSearchButtonClick}
            title={`${route.params.title}册本`}
            onBack={() => navigation.goBack()}
            titleColor={colorWhite}
            rightIcon={require('../assets/qietu/cebenxiangqing/book_details_icon_query_normal.png')}
          />
        </SafeAreaView>
      </LinearGradient>

      <SwipeListView<PdaReadDataDtoHolder>
        style={styles.items}
        data={BookSortItems}
        renderItem={renderBookItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleSize(18) }} />
        )}
        keyExtractor={(item) => item.item.custId.toString()}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
        }}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowHidden}>
            <SwipeButton
              style={styles.rowHiddenStatic}
              title="置顶"
              icon={require('../assets/qietu/cebenxiangqing/book_details_icon_top_normal.png')}
              onClick={() => topRow(rowMap, data.item.item.bookId)}
            />
            <SwipeButton
              style={styles.rowHiddenDelete}
              title="取消"
              icon={require('../assets/qietu/cebenxiangqing/book_details_icon_cancel_normal.png')}
              onClick={() => closeRow(rowMap, data.item.item.bookId)}
            />
          </View>
        )}
        leftOpenValue={scaleSize(240)}
        rightOpenValue={scaleSize(-240)}
        disableRightSwipe={true}
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
});

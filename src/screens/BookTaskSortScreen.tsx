import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize } from 'react-native-responsive-design';
import BooksBackTitleBar from '../components/titlebars/BooksBackTitleBar';
import { PdaReadDataDto } from '../../apiclient/src/models';
import center from '../data';
import { Modal, Toast } from '@ant-design/react-native';
import BookSortItem from '../components/BookSortItem';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { RenderItemParams } from 'react-native-draggable-flatlist';
import SwipeableItem, { UnderlayParams } from 'react-native-swipeable-item';

import { PdaReadDataDtoHolder } from '../data/holders';
import SwipeButton from '../components/SwipeButton';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
import { BookSortIndexDto } from '../../apiclient/src/models/book-sort-index-dto';

export default function BookTaskSortScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'BookTaskSort'>>();
  const navigation = useNavigation();

  const [BookSortItems, setBookSortItems] = useState<PdaReadDataDtoHolder[]>(
    [],
  );
  const itemRefs = new Map<number, SwipeableItem<PdaReadDataDtoHolder>>();

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

  const saveSort = async () => {
    const key = Toast.loading('修改中');
    try {
      await center.updateBookSort(
        BookSortItems.map((it) => {
          const result: BookSortIndexDto = {
            custId: it.item.custId,
            bookSortIndex: it.item.bookSortIndex,
          };
          return result;
        }),
      );
      Toast.success('修改成功');
      navigation.goBack();
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      Toast.remove(key);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Modal.alert('是否保存册本序号？', '', [
          {
            text: '取消',
            onPress: () => navigation.goBack(),
          },
          {
            text: '保存',
            onPress: async () => {
              saveSort();
            },
          },
        ]);
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const closeRow = (item: PdaReadDataDtoHolder) => {
    if (itemRefs && itemRefs.get(item.item.custId)) {
      itemRefs.get(item.item.custId)?.close();
      console.log('关闭');
    }
  };

  const topRow = (item: PdaReadDataDtoHolder) => {
    closeRow(item);
    let newData = [...BookSortItems];
    const topItem = newData.find((it) => it.item.custId === item.item.custId);
    if (topItem) {
      topItem.item.bookSortIndex = 1;
      const others = newData.filter(
        (it) => it.item.custId !== item.item.custId,
      );
      others.forEach((it, index) => {
        it.item.bookSortIndex = index + 2;
      });
      newData = [topItem, ...others.sort((it) => it.item.bookSortIndex)];
      setBookSortItems(newData);
    }
  };

  const renderUnderlayLeft = ({
    item,
  }: UnderlayParams<PdaReadDataDtoHolder>) => (
    <View style={styles.rowHidden}>
      <SwipeButton
        style={styles.rowHiddenStatic}
        title="置顶"
        icon={require('../assets/qietu/cebenxiangqing/book_details_icon_top_normal.png')}
        onClick={() => topRow(item)}
      />
      <SwipeButton
        style={styles.rowHiddenDelete}
        title="取消"
        icon={require('../assets/qietu/cebenxiangqing/book_details_icon_cancel_normal.png')}
        onClick={() => closeRow(item)}
      />
    </View>
  );

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<PdaReadDataDtoHolder>) => {
    return (
      <SwipeableItem
        key={item.item.custId}
        item={item}
        ref={(ref) => {
          if (ref && !itemRefs.get(item.item.custId)) {
            itemRefs.set(item.item.custId, ref);
          }
        }}
        onChange={({ open }) => {
          if (open) {
            // Close all other open items
            [...itemRefs.entries()].forEach(([key, ref]) => {
              if (key !== item.item.custId && ref) {
                ref.close();
              }
            });
          }
        }}
        overSwipe={20}
        renderUnderlayLeft={renderUnderlayLeft}
        // renderUnderlayRight={renderUnderlayRight}
        snapPointsLeft={[150]}>
        <View>
          <TouchableOpacity
            activeOpacity={isActive ? 0.2 : 1.0}
            onLongPress={drag}
            onPress={() => {
              if (itemRefs && !itemRefs.get(item.item.custId)) {
                itemRefs.get(item.item.custId)?.close();
              }
            }}>
            <BookSortItem
              showExtra={false}
              item={item.item}
              key={item.item.custId}
            />
          </TouchableOpacity>
        </View>
      </SwipeableItem>
    );
  };

  const onSearchButtonClick = () => {};

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

      <DraggableFlatList<PdaReadDataDtoHolder>
        data={BookSortItems}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleSize(18) }} />
        )}
        keyExtractor={(item) => item.item.custId.toString()}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
          paddingTop: scaleSize(18),
        }}
        onDragEnd={({ data }) => {
          data.forEach((value, index) => {
            value.item.bookSortIndex = index + 1;
          });
          setBookSortItems(data);
        }}
        activationDistance={20}
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
  rowHidden: {
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

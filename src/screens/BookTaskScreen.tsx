import * as React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  FlatList,
  TouchableOpacity,
  UIManager,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize } from 'react-native-responsive-design';
import { PdaReadDataDto } from '../../apiclient/src/models';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import BookDataItem from '../components/BookReadItem';
import { PdaReadDataDtoHolder } from '../data/holders';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import SearchBox from '../components/SearchBox';
import { Tabs } from '@ant-design/react-native';
import {
  NavigationProp,
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import { MainStackParamList } from './routeParams';
UIManager.setLayoutAnimationEnabledExperimental(false);
import DeviceInfo from 'react-native-device-info';

export default function BookTaskScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'BookTask'>>();
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const [bookDataItems, setBookDataItems] = useState<PdaReadDataDtoHolder[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const tabRef = React.useRef<Tabs>(null);
  const [tabIndex, setTabIndex] = useState(0);
  const f1Ref = React.useRef<FlatList<PdaReadDataDtoHolder>>(null);
  const f2Ref = React.useRef<FlatList<PdaReadDataDtoHolder>>(null);
  const f3Ref = React.useRef<FlatList<PdaReadDataDtoHolder>>(null);

  // useEffect(() => {
  //   const fetchLocal = async () => {
  //     try {
  //       const { bookId } = route.params;
  //       const res = await center.offline.getBookDataByIds([bookId]);
  //       const items = (res as PdaReadDataDto[]).map((value) => {
  //         const data: PdaReadDataDtoHolder = {
  //           item: value,
  //           showExtra: false,
  //         };
  //         return data;
  //       });
  //       setBookDataItems(items);
  //     } catch (e) {
  //       Toast.fail(e.message);
  //     }
  //   };

  //   fetchLocal();
  // }, [route.params]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchLocal = async () => {
        try {
          const { bookId } = route.params;
          const res = await center.offline.getBookDataByIds([bookId]);
          const items = (res as PdaReadDataDto[]).map((value) => {
            const data: PdaReadDataDtoHolder = {
              item: value,
              showExtra: false,
            };
            return data;
          });
          setBookDataItems(items);
        } catch (e) {
          Toast.fail(e.message);
        }
      };
      fetchLocal();
    }, [route.params]),
  );

  const refresh = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const key = Toast.loading('下载中');
    try {
      await center.sync(DeviceInfo.getUniqueId());
      const fetchLocal = async () => {
        try {
          const { bookId } = route.params;
          const res = await center.offline.getBookDataByIds([bookId]);
          const items = (res as PdaReadDataDto[]).map((value) => {
            const data: PdaReadDataDtoHolder = {
              item: value,
              showExtra: false,
            };
            return data;
          });
          setBookDataItems(items);
        } catch (e) {
          Toast.fail(e.message);
        }
      };
      await fetchLocal();
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      setLoading(false);
      Toast.remove(key);
    }
  };

  const getItemLayout = (
    data: PdaReadDataDtoHolder[] | null | undefined,
    index: number,
  ) => ({
    length: scaleSize(240 + 18),
    offset: scaleSize(240 + 18) * index,
    index,
  });

  const findIndex = (data: PdaReadDataDtoHolder[], text: string) => {
    return data.findIndex(
      (it) =>
        (it.item.custName || '').indexOf(text) > -1 ||
        (it.item.custCode?.toString() || '').indexOf(text) > -1 ||
        (it.item.custAddress || '').indexOf(text) > -1 ||
        it.item.bookSortIndex?.toString() === text,
    );
  };

  const onSearch = (text: string) => {
    if (tabIndex === 0) {
      const data = bookDataItems.filter((it) => it.item.recordState === 0);
      const index = findIndex(data, text);
      if (index > -1) {
        f1Ref.current?.scrollToIndex({ animated: true, index });
      }
    } else if (tabIndex === 1) {
      const data = bookDataItems.filter((it) => it.item.recordState !== 0);
      const index = findIndex(data, text);
      if (index > -1) {
        f2Ref.current?.scrollToIndex({ animated: true, index });
      }
    } else if (tabIndex === 2) {
      const index = findIndex(bookDataItems, text);
      if (index > -1) {
        f3Ref.current?.scrollToIndex({ animated: true, index });
      }
    }
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaReadDataDtoHolder>) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('NewRead', {
            data: info.item.item,
          });
        }}>
        <BookDataItem
          showExtra={info.item.showExtra}
          item={info.item.item}
          key={info.item.item.custId}
        />
      </TouchableOpacity>
    );
  };

  const renderDevideLine = () => <View style={{ height: scaleSize(18) }} />;
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
        <SafeAreaView edges={['right', 'top', 'left']}>
          <CommonTitleBarEx
            onBack={() => navigation.goBack()}
            onRight2Click={() =>
              navigation.navigate('BookTaskSort', route.params)
            }
            right1Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_refresh_normal.png')}
            onRight1Click={() => refresh()}
            right2Icon={require('../assets/qietu/cebenxiangqing/book_details_icon_adjustment_normal.png')}
            title={`${route.params.title}册本`}
            titleColor={colorWhite}
          />
          <SearchBox
            style={styles.searchContainer}
            placeholderTextColor={colorWhite}
            onSearch={onSearch}
          />
        </SafeAreaView>
      </LinearGradient>

      <Tabs
        ref={tabRef}
        prerenderingSiblingsNumber={2}
        tabs={[
          {
            title: `未抄(${
              bookDataItems.filter((it) => it.item.recordState === 0).length
            })`,
          },
          {
            title: `已抄(${
              bookDataItems.filter((it) => it.item.recordState !== 0).length
            })`,
          },
          { title: `全部(${bookDataItems.length})` },
        ]}
        tabBarUnderlineStyle={{ height: scaleSize(6) }}
        tabBarActiveTextColor="#4B92F4"
        tabBarInactiveTextColor="#333333"
        tabBarTextStyle={{ fontSize: scaleSize(36) }}
        onChange={(tab, index) => {
          setTabIndex(index);
        }}>
        <FlatList<PdaReadDataDtoHolder>
          style={styles.items}
          initialNumToRender={30}
          data={bookDataItems.filter((it) => it.item.recordState === 0)}
          renderItem={renderBookItem}
          ItemSeparatorComponent={renderDevideLine}
          keyExtractor={(item) => 'unread-' + item.item.custId.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
            paddingTop: scaleSize(18),
          }}
          ref={f1Ref}
          getItemLayout={getItemLayout}
        />
        <FlatList<PdaReadDataDtoHolder>
          style={styles.items}
          initialNumToRender={30}
          data={bookDataItems.filter((it) => it.item.recordState !== 0)}
          renderItem={renderBookItem}
          ItemSeparatorComponent={renderDevideLine}
          keyExtractor={(item) => 'read-' + item.item.custId.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
            paddingTop: scaleSize(18),
          }}
          ref={f2Ref}
        />
        <FlatList<PdaReadDataDtoHolder>
          style={styles.items}
          initialNumToRender={30}
          data={bookDataItems}
          renderItem={renderBookItem}
          ItemSeparatorComponent={renderDevideLine}
          keyExtractor={(item) => 'all-' + item.item.custId.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
            paddingTop: scaleSize(18),
          }}
          ref={f3Ref}
        />
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
});

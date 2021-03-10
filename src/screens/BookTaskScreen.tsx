import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, ListRenderItemInfo } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import { PdaReadDataDto } from '../../apiclient/src/models';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import BookDataItem from '../components/BookReadItem';
import { PdaReadDataDtoHolder } from '../data/holders';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import CommonTitleBarEx from '../components/titlebars/CommonTitleBarEx';
import SearchBox from '../components/SearchBox';
import { Tabs } from '@ant-design/react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';

export default function BookTaskScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'BookTask'>>();
  const navigation = useNavigation();

  const [bookDataItems, setBookDataItems] = useState<PdaReadDataDtoHolder[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
  }, [route.params]);

  const refresh = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    const key = Toast.loading('下载中');
    try {
      const res = await center.getBookDataByIds([route.params.bookId]);
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
    } finally {
      setLoading(false);
      Toast.remove(key);
    }
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaReadDataDtoHolder>) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        onLongPress={() => {
          const items = bookDataItems.map((item) => {
            if (item.item.custId === info.item.item.custId) {
              item.showExtra = true;
            } else {
              item.showExtra = false;
            }
            return item;
          });
          setBookDataItems(items);
        }}
        onPressOut={() => {
          const items = bookDataItems.map((item) => {
            item.showExtra = false;
            return item;
          });
          setBookDataItems(items);
        }}
        onPress={() =>
          navigation.navigate('NewRead', {
            data: info.item.item,
          })
        }>
        <BookDataItem
          showExtra={info.item.showExtra}
          item={info.item.item}
          key={info.item.item.custId}
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
          />
        </SafeAreaView>
      </LinearGradient>

      <Tabs
        tabs={[
          {
            title: `未抄(${
              bookDataItems.filter((it) => !it.item.reading).length
            })`,
          },
          {
            title: `已抄(${
              bookDataItems.filter((it) => !!it.item.reading).length
            })`,
          },
          { title: `全部(${bookDataItems.length})` },
        ]}
        tabBarUnderlineStyle={{ height: scaleSize(6) }}
        tabBarActiveTextColor="#4B92F4"
        tabBarInactiveTextColor="#333333">
        <FlatList<PdaReadDataDtoHolder>
          style={styles.items}
          data={bookDataItems.filter((it) => !it.item.reading)}
          renderItem={renderBookItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: scaleSize(18) }} />
          )}
          keyExtractor={(item) => 'unread-' + item.item.custId.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
            paddingTop: scaleSize(18),
          }}
        />
        <FlatList<PdaReadDataDtoHolder>
          style={styles.items}
          data={bookDataItems.filter((it) => !!it.item.reading)}
          renderItem={renderBookItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: scaleSize(18) }} />
          )}
          keyExtractor={(item) => 'read-' + item.item.custId.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
            paddingTop: scaleSize(18),
          }}
        />
        <FlatList<PdaReadDataDtoHolder>
          style={styles.items}
          data={bookDataItems}
          renderItem={renderBookItem}
          ItemSeparatorComponent={() => (
            <View style={{ height: scaleSize(18) }} />
          )}
          keyExtractor={(item) => 'all-' + item.item.custId.toString()}
          contentInset={{ bottom: 100 }}
          contentContainerStyle={{
            paddingBottom: scaleSize(30),
            paddingTop: scaleSize(18),
          }}
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
});

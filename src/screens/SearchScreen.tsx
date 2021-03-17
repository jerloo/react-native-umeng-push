import * as React from 'react';
import { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  FlatList,
  TouchableOpacity,
  Text,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import SearchPageBox from '../components/SearchPageBox';
import { PdaCustListDto } from '../../apiclient/src/models';
import { getSearchHistory, setSearchHistory } from '../utils/searchUtils';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import { NavigationProp, useNavigation } from '@react-navigation/core';
import { MainStackParamList } from './routeParams';

export default function SearchScreen() {
  const navigation = useNavigation<NavigationProp<MainStackParamList>>();

  const [historyItems, setHistoryItems] = useState<PdaCustListDto[]>([]);
  const [items, setItems] = useState<PdaCustListDto[]>([]);
  const [queryKey, setQueryKey] = useState('');

  React.useEffect(() => {
    getSearchHistory().then((data) => {
      setHistoryItems(data);
      console.log('最近搜索', data);
    });
  }, []);

  const query = async () => {
    const key = Toast.loading('搜索中');
    try {
      const result = await center.homeQuery(queryKey);
      setItems(result);
    } catch (e) {
      Toast.fail(e.message);
    } finally {
      Toast.remove(key);
    }
  };

  const onClick = (item: PdaCustListDto) => {
    const ex = historyItems.filter((it) => it.id !== item.id) || [];
    const newHistory = [item, ...ex];
    setSearchHistory(newHistory);
    getSearchHistory().then((data) => setHistoryItems(data));

    navigation.navigate('CustDetails', {
      data: {
        bookCode: item.bookCode,
        custName: item.custName,
        custId: item.id,
        custCode: item.custCode,
        custAddress: item.custAddress,
      },
    });
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaCustListDto>) => {
    return (
      <TouchableOpacity
        activeOpacity={1.0}
        style={styles.item}
        onPress={() => onClick(info.item)}>
        <Text style={styles.itemPartText}>{info.item.custCode}</Text>
        <View style={styles.itemPartLine} />
        <Text style={styles.itemPartText}>{info.item.custName}</Text>
        <View style={styles.itemPartLine} />
        <Text style={styles.itemPartText}>{info.item.custAddress}</Text>
        <View style={styles.itemPartLine} />
        <Text style={styles.itemPartText}>{info.item.bookCode}</Text>
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
          <SearchPageBox
            onDone={query}
            onChangeText={(text) => setQueryKey(text)}
          />
        </SafeAreaView>
      </LinearGradient>

      {historyItems.length !== 0 && items.length === 0 ? (
        <Text style={styles.title}>最近搜索</Text>
      ) : null}

      <FlatList<PdaCustListDto>
        style={styles.items}
        data={items.length === 0 ? historyItems : items}
        renderItem={renderBookItem}
        ItemSeparatorComponent={() => (
          <View style={{ height: scaleSize(18) }} />
        )}
        keyExtractor={(item) => item.id}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
        }}
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
    marginTop: scaleSize(30),
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: scaleSize(40),
  },
  itemPartText: {
    color: '#333333',
    fontSize: scaleSize(28),
  },
  itemPartLine: {
    width: scaleSize(2),
    backgroundColor: '#D8D8D8',
    marginHorizontal: scaleSize(18),
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
  title: {
    fontSize: scaleSize(40),
    color: '#333333',
    marginTop: scaleSize(30),
    marginStart: scaleSize(40),
  },
});

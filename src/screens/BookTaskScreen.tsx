import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import { getSession, UserSession } from '../utils/sesstionUtils';
import { BooksBackTitleBar } from '../components/BooksBackTitleBar';
import { PdaReadDataDto } from '../../apiclient/src/models';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import BookDataItem from './BookReadItem';

export default function BookTaskScreen({ route, navigation }: any) {
  const [session, setSession] = useState<UserSession>();
  const [bookDataItems, setBookDataItems] = useState<PdaReadDataDto[]>([]);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s || undefined);
    });
  }, []);

  useEffect(() => {
    const { bookId } = route.params;

    center.getBookDataByIds([bookId]).then((res) => {
      if (res instanceof String) {
        Toast.fail(res as string);
      } else {
        const items = res as PdaReadDataDto[];
        setBookDataItems(items);
      }
    });
  }, [route.params]);

  const renderBookItem = (info: ListRenderItemInfo<PdaReadDataDto>) => {
    return (
      <View style={styles.item} key={info.item.custId}>
        <BookDataItem item={info.item} />
      </View>
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
          <BooksBackTitleBar onBack={() => navigation.goBack()} />
        </SafeAreaView>
      </LinearGradient>

      <FlatList<PdaReadDataDto>
        style={styles.items}
        data={bookDataItems}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.custId.toString()}
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
});

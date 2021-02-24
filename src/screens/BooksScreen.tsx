import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ListRenderItemInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colorWhite } from '../styles';
import { scaleSize, setSpText2 } from 'react-native-responsive-design';
import { getSession, UserSession } from '../utils/sesstionUtils';
import { BooksBackTitleBar } from '../components/BooksBackTitleBar';
import { PdaMeterBookDto } from '../../apiclient/src/models';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import BookItem from '../components/BookItem';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import PdaMeterBookDtoHolder from '../data/bookHolder';
import CircleCheckBox from '../components/CircleCheckBox';

export default function BooksScreen({ navigation }: any) {
  const [session, setSession] = useState<UserSession>();
  const [demoBookItems, setDemoBookItems] = useState<PdaMeterBookDtoHolder[]>(
    [],
  );

  useEffect(() => {
    getSession().then((s) => {
      setSession(s || undefined);
    });
  }, []);

  useEffect(() => {
    center.getBookList().then((res) => {
      if (res instanceof String) {
        Toast.fail(res as string);
      } else {
        const items = (res as PdaMeterBookDto[]).map((value) => {
          const item: PdaMeterBookDtoHolder = {
            item: value,
            checked: false,
          };
          return item;
        });
        setDemoBookItems(items);
      }
    });
  }, []);

  const bookItemCheckClick = (holder: PdaMeterBookDtoHolder) => {
    demoBookItems.forEach((item) => {
      if (item.item.bookId === holder.item.bookId) {
        item.checked = !item.checked;
        console.log('更改状态', item);
      }
    });
    setDemoBookItems([...demoBookItems]);
  };

  const bookItemClick = (holder: PdaMeterBookDtoHolder) => {
    navigation.navigate('BookTask', {
      bookId: holder.item.bookId,
    });
  };

  const renderBookItem = (info: ListRenderItemInfo<PdaMeterBookDtoHolder>) => {
    return (
      <View style={styles.item} key={info.item.item.bookId}>
        <BookItem
          holder={info.item}
          onCheckClick={() => bookItemCheckClick(info.item)}
          onClick={() => bookItemClick(info.item)}
        />
      </View>
    );
  };

  const allBooksClick = () => {
    const allChecked = !demoBookItems.find((item) => item.checked === false);
    demoBookItems.forEach((item) => {
      item.checked = !allChecked;
    });
    setDemoBookItems([...demoBookItems]);
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

      <FlatList<PdaMeterBookDtoHolder>
        style={styles.items}
        data={demoBookItems}
        renderItem={renderBookItem}
        keyExtractor={(item) => item.item.bookId.toString()}
        contentInset={{ bottom: 100 }}
        contentContainerStyle={{
          paddingBottom: scaleSize(30),
        }}
      />

      <View style={styles.bottomContainer}>
        <CircleCheckBox
          title="全选"
          onClick={allBooksClick}
          checked={!demoBookItems.find((item) => item.checked === false)}
        />
        <View style={styles.bottomRight}>
          <Text style={styles.bottomLabel}>
            已选测本({demoBookItems.filter((item) => item.checked).length})
          </Text>
          <TouchableOpacity style={styles.btnDone}>
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
    marginHorizontal: scaleSize(30),
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

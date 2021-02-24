import * as React from 'react';
import { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scaleSize } from 'react-native-responsive-design';
import { getSession, UserSession } from '../utils/sesstionUtils';
import BooksBackTitleBar from '../components/BooksBackTitleBar';
import { PdaReadDataDto } from '../../apiclient/src/models';
import center from '../data';
import { PdaReadDataDtoHolder } from '../data/holders';
import { colorWhite } from '../styles';
import Tag from '../components/Tag';
import KeyBoard from '../components/KeyBoard';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import dayjs from 'dayjs';

export default function NewReadScreen({ route, navigation }: any) {
  const [session, setSession] = useState<UserSession>();
  const [bookDataItems, setBookDataItems] = useState<PdaReadDataDtoHolder[]>(
    [],
  );
  const { data } = route.params;
  const [newData, setNewData] = useState<PdaReadDataDto>(data);

  useEffect(() => {
    getSession().then((s) => {
      setSession(s || undefined);
    });
  }, []);

  const line = () => {
    return (
      <View style={{ height: scaleSize(1), backgroundColor: '#DEDEDE' }} />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.content}>
        <View style={styles.cornerContainer}>
          <Text style={styles.corner}>用户详情</Text>
          <View style={styles.colorBlank} />
        </View>
        <View style={styles.contentWrapper}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{newData.bookCode}</Text>
            <Text style={styles.subTitle}>({newData.custId})</Text>
          </View>
          <View style={styles.rightBottom}>
            <Image
              style={styles.iconLocation}
              source={require('../assets/qietu/cebenxiangqing/book_details_icon_address_normal.png')}
            />
            <Text style={styles.description}>{newData.custAddress}</Text>
          </View>
          <View style={styles.tags}>
            <Tag title="欠费" borderColor="#F5D28C" textColor="#EAAF38" />
            <Tag
              title="未抄"
              borderColor="#C2C2C2"
              textColor="#666666"
              style={{ marginStart: scaleSize(16) }}
            />
            <Tag
              title="换表"
              borderColor="#B6CEFB"
              textColor="#63A3FC"
              style={{ marginStart: scaleSize(16) }}
            />
          </View>
          {line()}
          <View style={styles.table}>
            <View style={styles.tableLeft}>
              <Text style={styles.tableLabel}>钢印号</Text>
              {line()}
              <Text style={styles.tableLabel}>上次抄表</Text>
              {line()}
              <Text style={styles.tableLabel}>抄表状态</Text>
              {line()}
              <Text style={styles.tableLabel}>上期抄码</Text>
              {line()}
              <Text style={styles.tableLabel}>本期抄码</Text>
              {line()}
              <Text style={styles.tableLabel}>抄见水量</Text>
              {line()}
              <Text style={styles.tableLabel}>预算金额</Text>
              <View
                style={{ height: scaleSize(10), backgroundColor: colorWhite }}
              />
            </View>
            <View style={styles.tableRight}>
              <Text style={styles.tableValue}>{newData.steelMark}</Text>
              {line()}
              <View style={styles.tableValueRow}>
                <Text style={styles.tableValue}>
                  {dayjs(newData.lastReadDate).format('YYYY-MM-DD')}
                </Text>
                <TouchableOpacity style={styles.tableValueButton}>
                  <Text style={styles.tableValueButtonText}>往期</Text>
                </TouchableOpacity>
              </View>

              {line()}
              <View style={styles.tableValueRow}>
                <Text style={styles.tableValue}>{newData.readWater}</Text>
                <TouchableOpacity style={styles.tableValueButton}>
                  <Text style={styles.tableValueButtonText}>更多</Text>
                </TouchableOpacity>
              </View>
              {line()}
              <Text style={styles.tableValue}>{newData.lastReading}</Text>
              {line()}
              <Text style={styles.tableValue}>{newData.reading}</Text>
              {line()}
              <Text style={styles.tableValue}>{newData.readWater}</Text>
              {line()}
              <View style={styles.tableValueRow}>
                <Text style={styles.tableValue}>{newData.readWater}</Text>
                <TouchableOpacity style={styles.tableValueButton}>
                  <Text style={styles.tableValueButtonText}>预算</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{ height: scaleSize(10), backgroundColor: colorWhite }}
              />
            </View>
          </View>
        </View>
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

      <SafeAreaView
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
        }}>
        <BooksBackTitleBar
          title="抄表录入"
          titleColor="#333333"
          onBack={() => navigation.goBack()}
          leftIcon={require('../assets/qietu/yonghuxiangqing/user_detailsr_icon_back_normal.png')}
          rightIcon={require('../assets/qietu/chaobiaoluru/enter_icon_enclosure_normal.png')}
        />
        <View style={styles.main}>
          <ScrollView>{renderContent()}</ScrollView>
          <View style={styles.maskRow}>
            <View style={styles.maskLeft}>
              <Image
                style={styles.maskIcon}
                source={require('../assets/qietu/chaobiaoluru/enter_icon_remarks_normal.png')}
              />
              <Text style={styles.maskTitle}>备注：</Text>
              <Text style={styles.maskContent}>点击添加备注(100字以内)</Text>
            </View>

            <Text style={styles.maskValue}>1123</Text>
          </View>
          <KeyBoard />
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
    backgroundColor: '#F5F5F5',
  },
  topContainer: {
    paddingBottom: scaleSize(30),
  },
  main: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    backgroundColor: colorWhite,
    marginHorizontal: scaleSize(30),
    marginTop: scaleSize(12),
    display: 'flex',
    flexDirection: 'column',
    borderRadius: scaleSize(4),
  },
  title: {
    color: '#333333',
    fontSize: scaleSize(34),
    fontWeight: 'bold',
  },
  subTitle: {
    color: '#333333',
    fontSize: scaleSize(30),
    marginStart: scaleSize(17),
  },
  cornerContainer: {
    // backgroundColor: '#7AAFFD',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
  colorBlank: {
    width: 0,
    height: 0,
    borderStyle: 'solid',
    backgroundColor: colorWhite,
    borderLeftWidth: scaleSize(0),
    borderBottomWidth: scaleSize(50),
    borderBottomColor: 'transparent',
    borderTopWidth: 0,
    borderTopColor: '#7AAFFD',
    borderRightColor: '#7AAFFD',
    borderRightWidth: scaleSize(40),
  },
  corner: {
    height: scaleSize(50),
    fontSize: scaleSize(24),
    color: colorWhite,
    backgroundColor: '#7AAFFD',
    paddingVertical: scaleSize(8),
    paddingHorizontal: scaleSize(18),
  },
  contentWrapper: {
    flex: 1,
    paddingHorizontal: scaleSize(30),
  },
  titleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableLeft: {},
  rightBottom: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: scaleSize(10),
  },
  description: {
    fontSize: scaleSize(26),
    color: '#666666',
    marginStart: scaleSize(15),
  },
  iconLocation: {
    width: scaleSize(26),
    height: scaleSize(33),
    marginTop: scaleSize(5),
  },
  tags: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: scaleSize(24),
  },
  table: {
    display: 'flex',
    flexDirection: 'row',
  },
  tableRight: {
    flex: 1,
  },
  tableLabel: {
    color: '#666666',
    fontSize: scaleSize(28),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(6),
  },
  tableValue: {
    color: '#333333',
    fontSize: scaleSize(28),
    marginStart: scaleSize(30),
    marginTop: scaleSize(24),
    marginBottom: scaleSize(6),
  },
  tableValueRow: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tableValueButton: {
    marginTop: scaleSize(24),
    marginBottom: scaleSize(6),
  },
  tableValueButtonText: {
    fontSize: scaleSize(26),
    color: '#0680FD',
  },
  maskRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: scaleSize(17),
    marginHorizontal: scaleSize(30),
  },
  maskLeft: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  maskIcon: {
    width: scaleSize(37),
    height: scaleSize(29),
  },
  maskTitle: {
    fontSize: scaleSize(28),
    color: '#333333',
    marginStart: scaleSize(14),
  },
  maskContent: {
    fontSize: scaleSize(26),
    color: '#666666',
  },
  maskValue: {
    fontSize: scaleSize(40),
    color: '#333333',
    fontWeight: 'bold',
  },
});

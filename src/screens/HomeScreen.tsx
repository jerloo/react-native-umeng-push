import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import { scaleSize, scaleHeight } from 'react-native-responsive-design';
import { getSession, UserSession } from '../utils/sesstionUtils';
import center from '../data';
import { setReadStateSettings } from '../utils/statesUtils';
import { useNavigation } from '@react-navigation/core';
import SearchBoxView from '../components/SearchBoxView';
import { setSystemSettings } from '../utils/systemSettingsUtils';
import { setBillMonth } from '../utils/billMonthUtils';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [session, setSession] = useState<UserSession>();

  useEffect(() => {
    getSession().then((s) => {
      setSession(s || undefined);
    });
  });

  const fetchStateSettings = async () => {
    try {
      const remoteStates = await center.online.getReadStates();
      setReadStateSettings(remoteStates);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchSystemSettings = async () => {
    try {
      const remoteSettings = await center.online.getSystemSettings();
      setSystemSettings(remoteSettings);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchBillMonth = async () => {
    try {
      const result = await center.getReadingMonth();
      if (result) {
        setBillMonth(result);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchBillMonth();
    fetchStateSettings();
    fetchSystemSettings();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <SafeAreaView style={styles.topContainer}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('Profile')}>
          <View style={styles.userProfile}>
            <Image
              style={styles.avatar}
              source={require('../assets/shouye-gerenxinxi.png')}
            />
            <Text style={styles.userName}>{session?.userInfo.name}</Text>
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Search')}>
          <SearchBoxView />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.groupTitle}>我的抄表</Text>
          <View style={styles.groupRow}>
            <HomeButton
              colorLeft="#096BF3"
              colorTop="#BED5F5"
              title="抄表任务"
              iconSource={require('../assets/shouye-chaobiaorengwu.png')}
              onPress={() => navigation.navigate('Books')}
            />
            <HomeButton
              colorLeft="#EFB541"
              colorTop="#EFB541"
              title="欠费查询"
              iconSource={require('../assets/shouye_qianfeichaxun.png')}
              onPress={() => navigation.navigate('Arrearages')}
            />
            <HomeButton
              colorLeft="#4CABFF"
              colorTop="#4CABFF"
              title="收费明细"
              iconSource={require('../assets/shouye-shoufeimingxi.png')}
              onPress={() => navigation.navigate('PaymentSubtotal')}
            />
          </View>

          <View style={styles.groupRow}>
            <HomeButton
              colorLeft="#6F65F2"
              colorTop="#857CFF"
              title="抄表汇总"
              iconSource={require('../assets/shouye-chaobiaohuizong.png')}
              onPress={() => navigation.navigate('ReadingCollect')}
            />
            <HomeButton
              colorLeft="#E98649"
              colorTop="#E98649"
              title="收费汇总"
              iconSource={require('../assets/shouye-shoufeihuizong.png')}
              onPress={() => navigation.navigate('PaymentCollect')}
            />
            <View style={{ width: scaleSize(220), height: scaleSize(220) }} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  topContainer: {
    // paddingBottom: scaleHeight(28),
    paddingHorizontal: scaleSize(30),
  },
  userProfile: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    marginTop: scaleHeight(44),
    marginBottom: scaleHeight(34),
    alignItems: 'center',
  },
  userName: {
    fontSize: scaleSize(44),
    color: '#333333',
    fontWeight: '700',
    marginStart: scaleSize(15),
  },
  avatar: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  mainContainer: {
    flex: 1,
    // backgroundColor: '#F7F7F7',
    paddingHorizontal: scaleSize(30),
  },
  groupTitle: {
    fontSize: scaleSize(40),
    marginVertical: scaleSize(30),
    fontWeight: '700',
  },
  groupRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleHeight(30),
  },
  searchBoxContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: scaleHeight(40),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: scaleSize(10),
    height: scaleHeight(60),
  },
});

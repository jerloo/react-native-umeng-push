import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
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
import { Permission, Permissions } from '../utils/permissionUtils';
import { PdaUserPermissionDto } from '../../apiclient/src/models';
import { PERMISSIONS_CHECK } from '../utils/devUtils';

export default function HomeScreen() {
  const navigation = useNavigation();

  const [session, setSession] = useState<UserSession>();
  const [perms, setPerms] = useState<Permission[]>();

  const [loading, setLoading] = useState(false);

  const refreshPermissions = (psItems: PdaUserPermissionDto[]) => {
    const granteds = psItems?.filter((it) => it.isGranted || it.disabled);

    if (process.env.NODE_ENV !== 'production' || PERMISSIONS_CHECK) {
      setPerms(Permissions);
    } else {
      const ps: Permission[] = [];
      granteds?.forEach((it) => {
        const find = Permissions.find((i) => i.code === it.code);
        if (find) {
          ps.push(find);
        }
      });
      setPerms(ps);
    }
  };

  const fetchSession = async () => {
    const s = await getSession();
    if (s) {
      setSession(s);
      refreshPermissions(s.userInfo.userPermissions || []);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

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

  const fetchUserInfo = async () => {
    try {
      const result = await center.getUserInfo();
      if (result) {
        refreshPermissions(result.userPermissions || []);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchBillMonth();
    fetchStateSettings();
    fetchSystemSettings();
    fetchUserInfo();
  }, []);

  const refresh = async () => {
    setLoading(true);
    await Promise.all([
      fetchUserInfo(),
      fetchSystemSettings(),
      fetchStateSettings(),
      fetchBillMonth(),
    ]);
    setLoading(false);
  };

  const renderButton = (info: ListRenderItemInfo<Permission>) => (
    <View style={{ marginBottom: scaleSize(30), marginEnd: scaleSize(16) }}>
      <HomeButton
        title={info.item.title}
        iconSource={info.item.icon}
        onPress={() => navigation.navigate(info.item.route)}
      />
    </View>
  );

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
      <View style={styles.mainContainer}>
        <Text style={styles.groupTitle}>我的抄表</Text>

        <View style={[styles.groupRow, { flex: 1 }]}>
          <FlatList<Permission>
            data={perms}
            style={{ flex: 1 }}
            numColumns={3}
            renderItem={renderButton}
            keyExtractor={(it) => it.title}
            refreshing={loading}
            onRefresh={refresh}
          />
        </View>
      </View>
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

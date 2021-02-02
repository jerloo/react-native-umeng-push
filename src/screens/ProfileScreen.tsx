import * as React from 'react';
import {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import {BackTitleBar} from '../components/BackTitleBar';
import {getSession, setSession, UserSession} from '../utils/sesstionUtils';

export default function ProfileScreen({navigation}) {
  const [session, sSession] = useState<UserSession>();

  const fetchSession = async () => {
    const s = await getSession();
    if (s != null) {
      sSession(s);
    }
  };
  useEffect(() => {
    fetchSession();
  });

  const logout = async () => {
    if (session !== null) {
      session!!.autoLogin = false;
      await setSession(session!!);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <BackTitleBar onBack={() => navigation.goBack()} />
      <View style={styles.block}>
        <TouchableOpacity
          style={styles.blockRow}
          onPress={() => navigation.navigate('EditName')}>
          <Text style={styles.textPrimary}>姓名</Text>
          <View style={styles.blockRowRight}>
            <Text style={styles.textSec}>{session?.userInfo.name}</Text>
            <Image
              style={styles.arrowRight}
              source={require('../assets/btn_arrow_right.png')}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.divideLine} />
        <View style={styles.blockRow}>
          <Text style={styles.textPrimary}>账号</Text>
          <View style={styles.blockRowRight}>
            <Text style={styles.textSec}>{session?.userInfo.userName}</Text>
            <View style={styles.arrowRight} />
          </View>
        </View>
        <View style={styles.divideLine} />
        <TouchableOpacity
          style={styles.blockRow}
          onPress={() => navigation.navigate('EditPhone')}>
          <Text style={styles.textPrimary}>手机号</Text>
          <View style={styles.blockRowRight}>
            <Text style={styles.textSec}>{session?.userInfo.phoneNumber}</Text>
            <Image
              style={styles.arrowRight}
              source={require('../assets/btn_arrow_right.png')}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.divideLine} />
        <TouchableOpacity
          style={styles.blockRow}
          onPress={() => navigation.navigate('EditPassword')}>
          <Text style={styles.textPrimary}>密码修改</Text>
          <Text style={styles.textSec} />
          <Image
            style={styles.arrowRight}
            source={require('../assets/btn_arrow_right.png')}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.block}>
        <TouchableOpacity style={styles.blockRow}>
          <Text style={styles.textPrimary}>日志上传</Text>
          <Text style={styles.textSec} />
          <Image
            style={styles.arrowRight}
            source={require('../assets/btn_arrow_right.png')}
          />
        </TouchableOpacity>
        <View style={styles.divideLine} />
        <TouchableOpacity style={styles.blockRow}>
          <Text style={styles.textPrimary}>版本信息</Text>
          <View style={styles.blockRowRight}>
            <Text style={styles.textSec}>V1.2.2</Text>
            <Image
              style={styles.arrowRight}
              source={require('../assets/btn_arrow_right.png')}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.block}>
        <TouchableOpacity style={styles.blockRow}>
          <Text style={styles.textPrimary}>清理缓存数据</Text>
          <Text style={styles.textSec} />
          <Image
            style={styles.arrowRight}
            source={require('../assets/btn_arrow_right.png')}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
}

const paddingScreen = scaleSize(30);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  block: {
    backgroundColor: '#FFFFFF',
    marginTop: scaleHeight(12),
    paddingBottom: scaleHeight(9),
  },
  blockRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginHorizontal: paddingScreen,
    paddingTop: scaleHeight(28),
    paddingBottom: scaleHeight(12),
  },
  textPrimary: {
    color: '#333333',
    fontSize: setSpText2(34),
    alignSelf: 'flex-start',
  },
  textSec: {
    color: '#999999',
    fontSize: setSpText2(32),
    alignSelf: 'flex-end',
  },
  arrowRight: {
    width: scaleSize(17),
    height: scaleHeight(31),
    alignSelf: 'flex-end',
    marginStart: scaleSize(12),
  },
  blockRowRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutButton: {
    paddingVertical: scaleHeight(21),
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginTop: scaleHeight(30),
  },
  logoutButtonText: {
    fontSize: setSpText2(34),
    color: '#333333',
  },
  divideLine: {
    backgroundColor: '#DEDEDE',
    height: 0.8,
    marginHorizontal: paddingScreen,
  },
});

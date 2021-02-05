import { Toast } from '@ant-design/react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import { BackTitleBar } from '../components/BackTitleBar';
import { colorWhite } from '../styles';
import {
  currentLogFileName,
  currentLogFilePath,
  getObjectKey,
  l,
} from '../utils/logUtils';
import { getSession, setSession, UserSession } from '../utils/sesstionUtils';
import CosXmlReactNative from '../utils/uploadUtils';
import center from '../data';
import Caches from 'react-native-caches';
import NetInfo from '@react-native-community/netinfo';
import { NO_NETWORK_ERROR } from '../data';
import DeviceInfo from 'react-native-device-info';

export default function ProfileScreen({ navigation }: any) {
  const [session, sSession] = useState<UserSession>();
  const [uploadLogVisible, setUploadLogVisible] = useState(false);
  const [checkVersionVisible, setCheckVersionVisible] = useState(false);
  const [clearCacheVisible, setClearCacheVisible] = useState(false);

  const fetchSession = async () => {
    const s = await getSession();
    if (s != null) {
      sSession(s);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const logout = async () => {
    if (session !== null) {
      session!!.autoLogin = false;
      await setSession(session!!);
    }
  };

  const uploadLog = async () => {
    setUploadLogVisible(false);
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable !== true) {
      Toast.fail(NO_NETWORK_ERROR);
      return;
    }
    // /handa/202101/zhangsa/2021-02-05-001.log.txt
    const objectName = await getObjectKey();
    console.log('log file object name', objectName);
    const uploadRequest = {
      bucket: 'mobilereadapp-1259078701',
      object: objectName,
      // 文件本地 Uri 或者 路径
      fileUri: 'file://' + currentLogFilePath,
    };

    const key = Toast.loading('上传中', 0);
    // 上传 与 暂停后续传对象
    // 注意如果是续传，请务必跟初始上传使用同一个 uploadRequest 对象
    try {
      const uploadResult = await CosXmlReactNative.upload(
        uploadRequest,
        (processedBytes: number, targetBytes: number) => {
          // 回调进度
          l.debug('put Progress callback : ', processedBytes, targetBytes);
          // setProgress(processedBytes / targetBytes);
        },
      );
      // info 包含上传结果
      const result = await center.uploadLogFile(
        currentLogFileName,
        uploadResult.Location,
      );
      Toast.remove(key);
      if (result === true) {
        Toast.success('上传成功');
      } else {
        Toast.fail('上传失败');
      }
    } catch (e) {
      console.log(e);
      Toast.remove(key);
      Toast.fail('上传失败');
    }
  };

  const clearCache = async () => {
    setClearCacheVisible(false);
    try {
      await Caches.runClearCache();
      Toast.success('清理缓存成功');
    } catch {
      Toast.success('清理缓存失败');
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
        <TouchableOpacity
          style={styles.blockRow}
          onPress={() => setUploadLogVisible(true)}>
          <Text style={styles.textPrimary}>日志上传</Text>
          <Text style={styles.textSec} />
          <Image
            style={styles.arrowRight}
            source={require('../assets/btn_arrow_right.png')}
          />
        </TouchableOpacity>
        <View style={styles.divideLine} />
        <TouchableOpacity
          style={styles.blockRow}
          onPress={() => setCheckVersionVisible(true)}>
          <Text style={styles.textPrimary}>版本信息</Text>
          <View style={styles.blockRowRight}>
            <Text style={styles.textSec}>V{DeviceInfo.getVersion()}</Text>
            <Image
              style={styles.arrowRight}
              source={require('../assets/btn_arrow_right.png')}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.block}>
        <TouchableOpacity
          style={styles.blockRow}
          onPress={() => setClearCacheVisible(true)}>
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
      <BottomSheet
        modalProps={{}}
        isVisible={uploadLogVisible}
        containerStyle={styles.bottomBackground}>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomTitleContainer}>
            <Text style={styles.bottomTitle}>确认上传日志？</Text>
          </View>
          <View style={styles.bottomDivide} />
          <ListItem
            containerStyle={styles.bottomConfirmButton}
            onPress={uploadLog}>
            <ListItem.Content>
              <ListItem.Title style={styles.bottomConfirmText}>
                确定
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <View style={styles.bottomDivide} />
          <ListItem
            containerStyle={styles.bottomCancelButton}
            onPress={() => setUploadLogVisible(false)}>
            <ListItem.Content>
              <ListItem.Title style={styles.bottomCancelText}>
                取消
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </BottomSheet>
      <BottomSheet
        modalProps={{}}
        isVisible={checkVersionVisible}
        containerStyle={styles.bottomBackground}>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomTitleContainer}>
            <Text style={styles.bottomTitle}>当前已是最新版本</Text>
          </View>
          <View style={styles.bottomDivide} />
          <ListItem
            containerStyle={styles.bottomConfirmButton}
            onPress={() => setCheckVersionVisible(false)}>
            <ListItem.Content>
              <ListItem.Title style={styles.bottomConfirmText}>
                确定
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <View style={styles.bottomDivide} />
          <ListItem
            containerStyle={styles.bottomCancelButton}
            onPress={() => setCheckVersionVisible(false)}>
            <ListItem.Content>
              <ListItem.Title style={styles.bottomCancelText}>
                取消
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </BottomSheet>
      <BottomSheet
        modalProps={{}}
        isVisible={clearCacheVisible}
        containerStyle={styles.bottomBackground}>
        <View style={styles.bottomContainer}>
          <View style={styles.bottomTitleContainer}>
            <Text style={styles.bottomTitle}>确定清空手机抄表本地记录？</Text>
            <Text style={styles.bottomConfirmText}>
              （包含数据、图片、视频等）
            </Text>
          </View>
          <View style={styles.bottomDivide} />
          <ListItem
            containerStyle={styles.bottomConfirmButton}
            onPress={clearCache}>
            <ListItem.Content>
              <ListItem.Title style={styles.bottomCancelText}>
                确定
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <View style={styles.bottomDivide} />
          <ListItem
            containerStyle={styles.bottomCancelButton}
            onPress={() => setClearCacheVisible(false)}>
            <ListItem.Content>
              <ListItem.Title style={styles.bottomCancelText}>
                取消
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </BottomSheet>
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
  bottomBackground: {
    backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)',
  },
  bottomContainer: {
    backgroundColor: colorWhite,
    paddingBottom: scaleHeight(70),
  },
  bottomTitleContainer: {
    paddingTop: scaleHeight(60),
    paddingBottom: scaleHeight(30),
  },
  bottomTitle: {
    fontSize: setSpText2(34),
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '700',
  },
  bottomConfirmButton: {
    fontSize: setSpText2(34),
    paddingVertical: scaleHeight(21),
  },
  bottomCancelButton: {
    fontSize: setSpText2(34),
    paddingVertical: scaleHeight(21),
  },
  bottomConfirmText: {
    fontSize: setSpText2(34),
    textAlign: 'center',
    alignSelf: 'center',
    color: '#096BF3',
  },
  bottomCancelText: {
    fontSize: setSpText2(34),
    textAlign: 'center',
    alignSelf: 'center',
  },
  bottomDivide: {
    height: scaleSize(4),
    backgroundColor: '#F9F9F9',
  },
});

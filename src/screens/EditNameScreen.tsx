import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { scaleHeight, scaleSize } from 'react-native-responsive-design';
import { getSession } from '../utils/sesstionUtils';
import EditTitleBar from '../components/titlebars/EditTitleBar';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/core';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditNameScreen() {
  const navigation = useNavigation();

  const [name, setName] = useState('');

  const fetchSession = async () => {
    const s = await getSession();
    if (s != null) {
      setName(s.userInfo.name);
    }
  };
  useEffect(() => {
    fetchSession();
  }, []);

  const onSave = async () => {
    const key = Toast.loading('保存中', 0);
    try {
      const result = await center.updateName(name);
      if (result === true) {
        Toast.remove(key);
        Toast.success('修改成功');
        navigation.goBack();
      } else {
        Toast.remove(key);
        Toast.fail('修改失败');
      }
    } catch (e) {
      Toast.remove(key);
      Toast.fail(e.message);
    } finally {
      Toast.remove(key);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />

      {Platform.OS === 'ios' ? (
        <SafeAreaView edges={['top']}>
          <EditTitleBar
            title="姓名修改"
            canDone={name !== ''}
            onBack={() => navigation.goBack()}
            onDone={onSave}
          />
        </SafeAreaView>
      ) : (
        <EditTitleBar
          title="姓名修改"
          canDone={name !== ''}
          onBack={() => navigation.goBack()}
          onDone={onSave}
        />
      )}

      <View style={styles.block}>
        <TextInput
          multiline={false}
          numberOfLines={1}
          underlineColorAndroid="transparent"
          placeholder="请输入姓名"
          keyboardType="default"
          style={styles.inputStyle}
          onChangeText={(text) => setName(text)}
          defaultValue={name}
        />
        <TouchableOpacity onPress={() => setName('')}>
          <Image
            style={styles.clearButtonImage}
            source={require('../assets/qietu/dengluye/logon_icon_cancel.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const paddingScreen = scaleSize(30);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  titleBar: {
    backgroundColor: '#F5F5F5',
    paddingTop: (StatusBar.currentHeight || 0) + scaleHeight(20),
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: paddingScreen,
    paddingVertical: scaleHeight(20),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleBarBackButton: {
    // height: scaleHeight(32),
    // alignSelf: 'flex-start',
    fontSize: scaleSize(30),
  },
  titleBarTitle: {
    fontSize: scaleSize(40),
    color: '#333333',
    // alignSelf: 'center',
  },
  titleBarDoneButton: {
    backgroundColor: '#E6E6E6',
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleHeight(3),
    borderRadius: scaleSize(4),
    fontSize: scaleSize(30),
  },
  titleBarDoneButtonText: {
    color: '#999999',
  },
  titleBarDoneEnabledButton: {
    backgroundColor: '#096BF3',
  },
  titleBarDoneEnabledText: {
    color: '#FFFFFF',
  },
  block: {
    backgroundColor: '#FFFFFF',
    marginTop: scaleHeight(12),
    marginBottom: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: paddingScreen,
    paddingTop: scaleSize(12),
    paddingBottom: scaleSize(12),
  },
  inputStyle: {
    fontSize: scaleSize(34),
    backgroundColor: 'white',
    paddingHorizontal: 0,
    flex: 1,
  },
  clearButtonImage: {
    width: scaleSize(30),
    height: scaleSize(30),
  },
});

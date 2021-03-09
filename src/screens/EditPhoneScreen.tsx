import { Toast } from '@ant-design/react-native';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import EditTitleBar from '../components/titlebars/EditTitleBar';
import { getSession, UserSession } from '../utils/sesstionUtils';
import center from '../data';
import { useNavigation } from '@react-navigation/core';

export default function EditPhoneScreen() {
  const navigation = useNavigation();

  const [session, sSession] = useState<UserSession>();
  const [newPhone, setNewPhone] = useState('');

  const fetchSession = async () => {
    const s = await getSession();
    if (s != null) {
      sSession(s);
    }
  };
  useEffect(() => {
    fetchSession();
  }, []);

  const onSave = async () => {
    const key = Toast.loading('保存中', 0);
    try {
      const result = await center.updatePhoneNumber(newPhone);
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
      Toast.fail(e);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <EditTitleBar
        title="手机号修改"
        canDone={newPhone !== '' && newPhone.length >= 11}
        onBack={() => navigation.goBack()}
        onDone={onSave}
      />
      <View style={styles.block}>
        <View style={styles.blockRow}>
          <Text style={styles.textTitleCurrent}>当前手机号</Text>
          <Text style={styles.textPhoneCurrent}>
            {session?.userInfo.phoneNumber || '未设置手机号'}
          </Text>
        </View>
        <View style={styles.divideLine} />
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>新手机号</Text>
          <TextInput
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="phone-pad"
            placeholder="请输入您的新手机号"
            defaultValue={newPhone}
            onChangeText={(text) => setNewPhone(text)}
          />
        </View>
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
  block: {
    backgroundColor: '#FFFFFF',
    marginTop: scaleHeight(12),
  },
  blockRow: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: paddingScreen,
    paddingVertical: scaleHeight(21),
    alignItems: 'center',
  },
  blockRowInput: {
    marginHorizontal: paddingScreen,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitleCurrent: {
    color: '#333333',
    fontSize: setSpText2(34),
    alignSelf: 'flex-start',
  },
  textPhoneCurrent: {
    color: '#333333',
    fontSize: setSpText2(34),
    alignSelf: 'flex-start',
    marginStart: scaleSize(30),
  },
  textTitleNew: {
    color: '#333333',
    fontSize: setSpText2(34),
    alignSelf: 'flex-start',
    minWidth: scaleSize(170),
    textAlign: 'right',
    // backgroundColor: 'black',
    height: '100%',
    textAlignVertical: 'center',
  },
  divideLine: {
    backgroundColor: '#DEDEDE',
    height: 0.8,
    marginHorizontal: paddingScreen,
  },
  inputStyle: {
    fontSize: setSpText2(32),
    // backgroundColor: 'black',
    paddingHorizontal: 0,
    marginStart: scaleSize(30),
    flex: 1,
  },
});

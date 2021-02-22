import * as React from 'react';
import { useState } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import EditTitleBar from '../components/EditTitleBar';
import center from '../data';
import { Toast } from '@ant-design/react-native';

export default function EditPasswordScreen({ navigation }: any) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPasword, setConfirmPassword] = useState('');

  const onSave = async () => {
    // if (!/^(?=.*?[0-9])(?=.*?[a-z])[0-9a-z]{8,}$/.test(newPassword)) {
    //   Toast.fail('密码必须至少8位字符，同时需包含字母和数字');
    //   return;
    // }
    if (oldPassword === newPassword) {
      Toast.fail('新密码和旧密码不能相同');
      return;
    }
    const key = Toast.loading('保存中', 0);
    const result = await center.changePassword(oldPassword, newPassword);
    if (result === true) {
      Toast.remove(key);
      Toast.success('修改成功');
      navigation.goBack();
    } else {
      Toast.remove(key);
      Toast.fail('修改失败');
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
        title="密码修改"
        canDone={
          oldPassword !== '' &&
          newPassword !== '' &&
          newPassword === confirmPasword
        }
        onBack={() => navigation.goBack()}
        onDone={onSave}
      />
      <View style={styles.block}>
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>旧密码</Text>
          <TextInput
            textContentType="password"
            secureTextEntry={true}
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="default"
            placeholder="请输入旧密码"
            defaultValue={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
          />
        </View>
        <View style={styles.divideLine} />
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>新密码</Text>
          <TextInput
            textContentType="password"
            secureTextEntry={true}
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="default"
            placeholder="请输入新密码"
            defaultValue={newPassword}
            onChangeText={(text) => setNewPassword(text)}
          />
        </View>
        <View style={styles.divideLine} />
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>确认密码</Text>
          <TextInput
            textContentType="password"
            secureTextEntry={true}
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="default"
            placeholder="请输入新密码"
            defaultValue={confirmPasword}
            onChangeText={(text) => setConfirmPassword(text)}
          />
        </View>

        <View style={styles.divideLine} />

        <Text style={styles.remark}>
          密码必须至少8位字符，同时需包含字母和数字
        </Text>
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
    minWidth: scaleSize(136),
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
  remark: {
    fontSize: setSpText2(28),
    color: '#4B92F4',
    marginTop: scaleHeight(24),
    paddingBottom: scaleHeight(32),
    marginHorizontal: paddingScreen,
  },
});

import * as React from 'react';
import { useState } from 'react';
import { StatusBar, StyleSheet, Text, View, Image } from 'react-native';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import EditTitleBar from '../components/titlebars/EditTitleBar';
import center from '../data';
import { Toast } from '@ant-design/react-native';
import { useNavigation } from '@react-navigation/core';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PasswordInput from '../components/PasswordInput';
import { SafeAreaView } from 'react-native-safe-area-context';

const PASSWORD_REG = /^(?=.*?[0-9])(?=.*?[a-zA-Z]).{8,}$/;

export default function EditPasswordScreen() {
  const navigation = useNavigation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPasword, setConfirmPassword] = useState('');
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const onSave = async () => {
    if (!PASSWORD_REG.test(newPassword)) {
      Toast.fail('密码必须至少8位字符，同时需包含字母和数字');
      return;
    }
    if (oldPassword === newPassword) {
      Toast.fail('新密码和旧密码不能相同');
      return;
    }
    if (newPassword !== confirmPasword) {
      Toast.fail('新密码与确认密码不一致');
      return;
    }
    const key = Toast.loading('保存中', 0);
    try {
      const result = await center.changePassword(oldPassword, newPassword);
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
      <SafeAreaView edges={['top']}>
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
      </SafeAreaView>

      <View style={styles.block}>
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>旧密码</Text>
          <PasswordInput
            textContentType="password"
            secureTextEntry={!oldPasswordVisible}
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="default"
            placeholder="请输入旧密码"
            defaultValue={oldPassword}
            onChangeText={(text) => setOldPassword(text)}
            rightIcon={
              <TouchableOpacity
                onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
                <Image
                  resizeMode="contain"
                  style={styles.eyeOpen}
                  source={
                    !oldPasswordVisible
                      ? require('../assets/dengluye-mimazhanshi.png')
                      : require('../assets/dengluye-mimapingbi.png')
                  }
                />
              </TouchableOpacity>
            }
          />
        </View>
        <View style={styles.divideLine} />
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>新密码</Text>
          <PasswordInput
            textContentType="password"
            secureTextEntry={!newPasswordVisible}
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="default"
            placeholder="请输入新密码"
            defaultValue={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            rightIcon={
              <TouchableOpacity
                onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
                <Image
                  resizeMode="contain"
                  style={styles.eyeOpen}
                  source={
                    !newPasswordVisible
                      ? require('../assets/dengluye-mimazhanshi.png')
                      : require('../assets/dengluye-mimapingbi.png')
                  }
                />
              </TouchableOpacity>
            }
          />
        </View>
        <View style={styles.divideLine} />
        <View style={styles.blockRowInput}>
          <Text style={styles.textTitleNew}>确认密码</Text>
          <PasswordInput
            textContentType="password"
            secureTextEntry={!confirmPasswordVisible}
            multiline={false}
            numberOfLines={1}
            underlineColorAndroid="transparent"
            style={styles.inputStyle}
            keyboardType="default"
            placeholder="请输入新密码"
            defaultValue={confirmPasword}
            onChangeText={(text) => setConfirmPassword(text)}
            rightIcon={
              <TouchableOpacity
                onPress={() =>
                  setConfirmPasswordVisible(!confirmPasswordVisible)
                }>
                <Image
                  resizeMode="contain"
                  style={styles.eyeOpen}
                  source={
                    !confirmPasswordVisible
                      ? require('../assets/dengluye-mimazhanshi.png')
                      : require('../assets/dengluye-mimapingbi.png')
                  }
                />
              </TouchableOpacity>
            }
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
    flex: 1,
    paddingVertical: 0,
    marginVertical: 0,
  },
  remark: {
    fontSize: setSpText2(28),
    color: '#4B92F4',
    marginTop: scaleHeight(24),
    paddingBottom: scaleHeight(32),
    marginHorizontal: paddingScreen,
  },
  eyeOpen: {
    width: scaleSize(32),
    height: scaleHeight(20),
  },
});

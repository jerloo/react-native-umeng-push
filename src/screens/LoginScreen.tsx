import * as React from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';

import {Input, CheckBox} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {colorWhite} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';

export default function LoginScreen() {
  const [remember, setRemember] = React.useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(true);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#0699FF', '#0D6CEC']}
        style={styles.topContainer}>
        <View>
          <Image
            style={styles.logo}
            source={require('../assets/login_logo.png')}
          />
        </View>
        <Text style={styles.title}>云抄表</Text>
      </LinearGradient>

      <View style={styles.mainContainer}>
        <View style={styles.containerWidget} />
        <Input
          multiline={false}
          numberOfLines={1}
          placeholder="机构编号"
          keyboardType="default"
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-jigoubianhao.png')}
            />
          }
          rightIcon={
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon name="close-circle" size={16} color="#CCCCCC" />
            </TouchableOpacity>
          }
        />
        <Input
          numberOfLines={1}
          editable={true}
          multiline={false}
          keyboardType="default"
          placeholder="输出账号"
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-zhanghao.png')}
            />
          }
          rightIcon={
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Icon name="close-circle" size={16} color="#CCCCCC" />
            </TouchableOpacity>
          }
        />
        <Input
          placeholder="输入密码"
          numberOfLines={1}
          multiline={false}
          textContentType="password"
          keyboardType="default"
          secureTextEntry={passwordVisible}
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-shuruimima.png')}
            />
          }
          rightIcon={
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}>
              <Image
                resizeMode="contain"
                style={styles.inputIcon}
                source={require('../assets/dengluye-mimapingbi.png')}
              />
            </TouchableOpacity>
          }
        />
        <CheckBox
          checkedIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/login_remember_checked.png')}
            />
          }
          uncheckedIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/login_remember_unchecked.png')}
            />
          }
          title="自动登录"
          containerStyle={styles.rememberContainer}
          checked={remember}
          onPress={() => setRemember(!remember)}
        />

        <LinearGradient
          colors={['#0699FF', '#0D6CEC']}
          style={styles.submitButton}>
          <Text style={styles.submitText}>登录</Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    flex: 2,
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    overflow: 'hidden',
    backgroundColor: colorWhite,
  },
  logo: {
    width: 63,
    height: 63,
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colorWhite,
    fontSize: 40,
    marginTop: 6,
  },
  inputIcon: {
    width: 16,
    height: 16,
  },
  rememberContainer: {
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
  },
  containerWidget: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0D6CEC',
    alignSelf: 'center',
    marginTop: -50,
    marginBottom: 50,
  },
  submitButton: {
    minHeight: 40,
    paddingVertical: 5,
    marginTop: 37,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  submitText: {
    fontSize: 20,
    color: colorWhite,
  },
});

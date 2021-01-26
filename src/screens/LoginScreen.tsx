import * as React from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';

import {Input, CheckBox} from 'react-native-elements';
import LinearGradient from 'react-native-linear-gradient';
import {colorWhite} from '../styles';

export default function LoginScreen() {
  const [remember, setRemember] = React.useState(true);

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
          placeholder="机构编号"
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-jigoubianhao.png')}
            />
          }
        />
        <Input
          placeholder="输出账号"
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-zhanghao.png')}
            />
          }
        />
        <Input
          placeholder="输入密码"
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-shuruimima.png')}
            />
          }
        />
        <CheckBox
          title="自动登录"
          containerStyle={styles.rememberContainer}
          checked={remember}
          onPress={() => setRemember(!remember)}
        />
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 25,
    overflow: 'hidden',
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
});

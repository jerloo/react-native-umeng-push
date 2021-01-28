import * as React from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';

import {Input, CheckBox} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {colorWhite} from '../styles';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimatedLoadingButton from 'rn-animated-loading-button';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import {api} from '../utils/apiUtils';

import {Toast} from '@ant-design/react-native';
import {setSession} from '../utils/sesstionUtils';

export default function LoginScreen({navigation}: {navigation: any}) {
  const [remember, setRemember] = React.useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(true);

  const [telnetName, setTelnetName] = React.useState('handa');
  const [userName, setUserName] = React.useState('malp');
  const [password, setPassword] = React.useState('Mobile_2021!.');

  var loadingButton = React.useRef<AnimatedLoadingButton>(null);

  const onSubmit = async () => {
    loadingButton?.current?.setLoading(true);
    if (telnetName === '') {
      Toast.fail('请输入机构名称');
      return;
    }
    if (userName === '') {
      Toast.fail('请输入账号');
      return;
    }
    if (password === '') {
      Toast.fail('请输入账号');
      return;
    }
    try {
      const loginResult = await api.loginApi.apiAppLoginLoginPost({
        tenantName: telnetName,
        userName: userName,
        passWord: password,
      });
      if (loginResult.status === 200) {
        await api.provider.set(
          loginResult.data.tokenType + ' ' + loginResult.data.accessToken,
        );
        const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
        if (infoResult.status === 200) {
          setSession({
            autoLogin: remember,
            userInfo: infoResult.data,
          });
          loadingButton?.current?.setLoading(false);
          navigation.navigate('Home');
        } else {
          loadingButton?.current?.setLoading(false);
          Toast.fail('服务器错误，请稍后再试');
        }
      } else {
        console.log(loginResult);
        loadingButton?.current?.setLoading(false);
        Toast.fail('用户名或密码错误');
      }
    } catch (e) {
      console.log(e);
      loadingButton?.current?.setLoading(false);
      Toast.fail('用户名或密码错误');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
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
          inputStyle={styles.inputStyle}
          onChangeText={(text) => setTelnetName(text)}
          value={telnetName}
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-jigoubianhao.png')}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setTelnetName('')}>
              <Icon name="close-circle" size={setSpText2(30)} color="#CCCCCC" />
            </TouchableOpacity>
          }
        />
        <Input
          numberOfLines={1}
          editable={true}
          multiline={false}
          keyboardType="default"
          placeholder="输入账号"
          inputStyle={styles.inputStyle}
          onChangeText={(text) => setUserName(text)}
          value={userName}
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-zhanghao.png')}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setUserName('')}>
              <Icon name="close-circle" size={setSpText2(30)} color="#CCCCCC" />
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
          inputStyle={styles.inputStyle}
          onChangeText={(text) => setPassword(text)}
          value={password}
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
                style={styles.eyeOpen}
                source={
                  !passwordVisible
                    ? require('../assets/dengluye-mimazhanshi.png')
                    : require('../assets/dengluye-mimapingbi.png')
                }
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
          textStyle={styles.rememberTitle}
          containerStyle={styles.rememberContainer}
          checked={remember}
          onPress={() => setRemember(!remember)}
        />

        <AnimatedLoadingButton
          ref={loadingButton}
          containerStyle={styles.submitButtonContainer}
          buttonStyle={styles.submitButton}
          title="登录"
          titleStyle={styles.submitText}
          onPress={onSubmit}
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
    marginTop: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 25,
    overflow: 'hidden',
    backgroundColor: colorWhite,
  },
  logo: {
    width: scaleSize(188),
    height: scaleSize(188),
  },
  logoContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    color: colorWhite,
    fontSize: setSpText2(40),
    marginTop: scaleHeight(19),
    fontWeight: 'bold',
  },
  inputIcon: {
    width: scaleSize(48),
    height: scaleSize(48),
  },
  inputStyle: {
    fontSize: setSpText2(34),
  },
  rememberContainer: {
    padding: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    borderWidth: 0,
  },
  rememberTitle: {
    fontSize: setSpText2(32),
    fontWeight: 'normal',
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
  submitButtonContainer: {
    height: scaleHeight(90),
    marginTop: scaleHeight(112),
  },
  submitButton: {
    backgroundColor: '#0D6CEC',
    borderRadius: scaleSize(50),
  },
  submitText: {
    fontSize: setSpText2(44),
    color: colorWhite,
  },
  eyeClose: {},
  eyeOpen: {
    width: scaleSize(32),
    height: scaleHeight(20),
  },
});

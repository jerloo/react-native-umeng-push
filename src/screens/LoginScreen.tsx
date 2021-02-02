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
import {logger as Logger} from 'react-native-logs';

import center from '../data';

import {Toast} from '@ant-design/react-native';
import {getSession} from '../utils/sesstionUtils';

const logger = Logger.createLogger();

export default function LoginScreen({navigation}: {navigation: any}) {
  const [remember, setRemember] = React.useState(true);
  const [passwordVisible, setPasswordVisible] = React.useState(true);

  const [tenantName, setTenantName] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [passWord, setPassword] = React.useState('');

  var loadingButton = React.useRef<AnimatedLoadingButton>(null);

  const onSubmit = async (t: string, u: string, p: string) => {
    if (t === '') {
      Toast.fail('请输入机构名称');
      return;
    }
    if (t === '') {
      Toast.fail('请输入账号');
      return;
    }
    if (p === '') {
      Toast.fail('请输入密码');
      return;
    }
    loadingButton?.current?.setLoading(true);
    const result = await center.login(
      {
        tenantName: t,
        userName: u,
        passWord: p,
      },
      remember,
    );
    if (result === true) {
      loadingButton.current?.setLoading(false);
      navigation.replace('Home');
    } else {
      Toast.fail(result as string);
      setTimeout(() => {
        loadingButton.current?.setLoading(false);
      }, 1000);
    }
  };

  const loadFetch = async () => {
    const session = await getSession();
    const pr = setRemember(session?.autoLogin ?? false);
    const pt = setTenantName(session?.tenantName ?? '');
    const pu = setUserName(session?.userInfo.userName ?? '');
    const pp = setPassword(session?.password ?? '');

    if (session?.autoLogin === true) {
      Promise.all([pr, pt, pu, pp]).then(() => {
        onSubmit(
          session.tenantName,
          session.userInfo.userName,
          session.password,
        );
      });
    }
  };

  const loadOnSubmit = React.useCallback(loadFetch, []);

  React.useEffect(() => {
    loadOnSubmit();
  }, [loadOnSubmit]);

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
          onChangeText={(text) => setTenantName(text)}
          value={tenantName}
          leftIcon={
            <Image
              style={styles.inputIcon}
              source={require('../assets/dengluye-jigoubianhao.png')}
            />
          }
          rightIcon={
            <TouchableOpacity onPress={() => setTenantName('')}>
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
          value={passWord}
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
          onPress={() => onSubmit(tenantName, userName, passWord)}
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

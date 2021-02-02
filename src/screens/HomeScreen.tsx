import * as React from 'react';
import {View, Text, StyleSheet, StatusBar, Image} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';
import HomeButton from '../components/HomeButton';
import {colorWhite} from '../styles';
import {
  scaleSize,
  scaleHeight,
  setSpText2,
} from 'react-native-responsive-design';
import {getSession, UserSession} from '../utils/sesstionUtils';

export default function HomeScreen({navigation}) {
  const [session, setSession] = React.useState<UserSession>();

  React.useEffect(() => {
    getSession().then((s) => {
      setSession(s || undefined);
    });
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />

      <LinearGradient
        colors={['#038FFF', '#066AF0']}
        style={styles.topContainer}>
        <SafeAreaView>
          <View style={styles.userProfile}>
            <Text style={styles.userName}>{session?.userInfo.name}</Text>
            <TouchableWithoutFeedback
              onPress={() => navigation.navigate('Profile')}>
              <Image
                style={styles.avatar}
                source={require('../assets/shouye-gerenxinxi.png')}
              />
            </TouchableWithoutFeedback>
          </View>
          <Input
            style={{fontSize: setSpText2(28)}}
            placeholder="户号/户名/地址/册本号"
            inputContainerStyle={styles.searchBoxContainer}
            inputStyle={styles.searchBox}
            placeholderTextColor={colorWhite}
            leftIcon={<Icon name="search" color="#FFFFFF" />}
            leftIconContainerStyle={{marginStart: scaleSize(30)}}
          />
        </SafeAreaView>
      </LinearGradient>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Text style={styles.groupTitle}>我的抄表</Text>
          <View style={styles.groupRow}>
            <HomeButton
              colorLeft="#096BF3"
              colorTop="#BED5F5"
              title="抄表任务"
              iconSource={require('../assets/shouye-chaobiaorengwu.png')}
            />
          </View>

          <Text style={styles.groupTitle}>统计分析</Text>
          <View style={styles.groupRow}>
            <HomeButton
              colorLeft="#EFB541"
              colorTop="#EFB541"
              title="欠费查询"
              iconSource={require('../assets/shouye_qianfeichaxun.png')}
            />
            <HomeButton
              colorLeft="#4CABFF"
              colorTop="#4CABFF"
              title="收费明细"
              iconSource={require('../assets/shouye-shoufeimingxi.png')}
            />
          </View>
          <View style={styles.groupRow}>
            <HomeButton
              colorLeft="#6F65F2"
              colorTop="#857CFF"
              title="抄表汇总"
              iconSource={require('../assets/shouye-chaobiaohuizong.png')}
            />
            <HomeButton
              colorLeft="#E98649"
              colorTop="#E98649"
              title="收费汇总"
              iconSource={require('../assets/shouye-shoufeihuizong.png')}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {},
  userProfile: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: scaleHeight(44),
    marginBottom: scaleHeight(32),
    paddingHorizontal: scaleSize(42),
    alignItems: 'center',
  },
  userName: {
    fontSize: setSpText2(44),
    color: colorWhite,
    fontWeight: 'bold',
  },
  avatar: {
    width: scaleSize(44),
    height: scaleSize(44),
  },
  mainContainer: {
    flex: 1,
    // backgroundColor: '#F7F7F7',
    padding: scaleSize(30),
  },
  groupTitle: {
    fontSize: setSpText2(40),
    marginBottom: scaleHeight(17),
    fontWeight: 'bold',
  },
  groupRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: scaleHeight(30),
  },
  searchBoxContainer: {
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: scaleHeight(40),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scaleSize(10),
  },
  searchBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

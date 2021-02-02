import * as React from 'react';
import {useState, useEffect} from 'react';
import {StatusBar, StyleSheet, View, TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  scaleHeight,
  scaleSize,
  setSpText2,
} from 'react-native-responsive-design';
import {getSession} from '../utils/sesstionUtils';
import Icon from 'react-native-vector-icons/Ionicons';
import EditTitleBar from '../components/EditTitleBar';
import center from '../data';
import {Toast} from '@ant-design/react-native';

export default function EditNameScreen({navigation}) {
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
    const result = await center.updateName(name);
    if (result === true) {
      Toast.remove(key);
      navigation.goBack();
    } else {
      Toast.remove(key);
      Toast.fail(result as string);
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
        title="姓名修改"
        canDone={name !== ''}
        onBack={() => navigation.goBack()}
        onDone={onSave}
      />

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
          <Icon name="close-circle" size={setSpText2(30)} color="#CCCCCC" />
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
    fontSize: setSpText2(30),
  },
  titleBarTitle: {
    fontSize: setSpText2(40),
    color: '#333333',
    // alignSelf: 'center',
  },
  titleBarDoneButton: {
    backgroundColor: '#E6E6E6',
    paddingHorizontal: scaleSize(15),
    paddingVertical: scaleHeight(3),
    borderRadius: scaleSize(4),
    fontSize: setSpText2(30),
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
  },
  inputStyle: {
    fontSize: setSpText2(34),
    backgroundColor: 'white',
    paddingHorizontal: 0,
    flex: 1,
  },
});

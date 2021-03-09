import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { scaleSize } from 'react-native-responsive-design';
import { colorWhite } from '../styles';
import { MainStackParamList } from './routeParams';

const MAX_DURATION = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function CameraScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'Camera'>>();
  const navigation = useNavigation();

  const camera = React.useRef<RNCamera>();
  const [timing, setTiming] = React.useState(0);

  const takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    const data = await camera?.current?.takePictureAsync(options);
    if (data?.uri) {
      route.params.callback(data?.uri);
      navigation.goBack();
    }
  };

  const [timer, setTimer] = React.useState<number>();

  const takeVideo = async () => {
    console.log('开始录像');
    setTiming(MAX_DURATION);
    const t = setInterval(() => {
      console.log('timing');
      if (timing > 1) {
        setTiming(timing - 1);
      }
    }, 1000);
    setTimer(t);
    setTimeout(() => {
      clearInterval(t);
    }, MAX_DURATION);

    const data = await camera?.current?.recordAsync({
      quality: '480p',
      maxDuration: MAX_DURATION,
      maxFileSize: MAX_FILE_SIZE,
    });
    if (data?.uri) {
      route.params.callback(data?.uri);
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={camera}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: '相机权限',
          message: '需要授权相机权限进行拍照',
          buttonPositive: '好的',
          buttonNegative: '取消',
        }}
        captureAudio={false}
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={takePicture}
          style={styles.capture}
          onLongPress={takeVideo}
          onPressOut={() => {
            camera?.current?.stopRecording();
            setTiming(0);
            clearInterval(timer);
            console.log('停止录像');
          }}>
          <AnimatedCircularProgress
            size={100}
            width={10}
            backgroundWidth={30}
            fill={(timing / MAX_DURATION) * 100}
            tintColor="red"
            backgroundColor={colorWhite}>
            {() => <Text style={styles.timing}>{timing}</Text>}
          </AnimatedCircularProgress>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  timing: {
    fontSize: scaleSize(40),
  },
});

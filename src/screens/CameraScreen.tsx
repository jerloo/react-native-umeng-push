import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { scaleSize } from 'react-native-responsive-design';
import Video from 'react-native-video';
import { MobileFileDto } from '../../apiclient/src/models';
import { colorWhite } from '../styles';
import { MainStackParamList } from './routeParams';
import { stat } from 'react-native-fs';
import { l } from '../utils/logUtils';
import ImageMarker, {
  Position,
  TextBackgroundType,
} from 'react-native-image-marker';
import dayjs from 'dayjs';

const MAX_DURATION = 10;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function CameraScreen() {
  const route = useRoute<RouteProp<MainStackParamList, 'Camera'>>();
  const navigation = useNavigation();

  const camera = React.useRef<RNCamera>(null);
  const [timing, setTiming] = React.useState(0);

  const [result, setResult] = React.useState<MobileFileDto>();

  const markImage = async (uri: any) => {
    return ImageMarker.markText({
      src: uri,
      text: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      position: Position.topRight,
      fontName: 'Arial-BoldItalicMT',
      X: 30,
      Y: 30,
      color: '#FFFFFF',
      fontSize: 44,
      shadowStyle: {
        dx: 10.5,
        dy: 20.8,
        radius: 20.9,
        color: '#ff00ff',
      },
      textBackgroundStyle: {
        type: TextBackgroundType.stretchY,
        paddingX: 10,
        paddingY: 10,
        color: 'transparent',
      },
      scale: 1,
      quality: 100,
    }).then((path) => {
      return Platform.OS === 'android' ? 'file://' + path : path;
    });
  };

  const takePicture = async () => {
    const options = { quality: 0.3, base64: true };
    const data = await camera?.current?.takePictureAsync(options);
    if (data?.uri) {
      const marked = await markImage(data?.uri);
      const fileInfo = await stat(marked);
      const r: MobileFileDto = {
        fileName: marked.substring(data?.uri.lastIndexOf('/') + 1),
        filePath: marked,
        fileSize: fileInfo.size,
        fileSource: 2,
      };
      setResult(r);
    }
  };

  const [timer, setTimer] = React.useState<number>();

  const takeVideo = async () => {
    l.info('开始录像');
    setTiming(MAX_DURATION);
    const t = setInterval(() => {
      l.info('timing');
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
      const fileInfo = await stat(data?.uri);
      const r: MobileFileDto = {
        fileName: data?.uri.substring(data?.uri.lastIndexOf('/')),
        filePath: data?.uri,
        fileSize: fileInfo.size,
        fileSource: 2,
      };
      setResult(r);
    }
  };

  const back = () => {
    if (result) {
      route.params.callback(result);
    }
    navigation.goBack();
  };

  const renderTakeButton = () => {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'center',
        }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={takePicture}
          style={styles.capture}
          onLongPress={takeVideo}
          onPressOut={() => {
            camera?.current?.stopRecording();
            setTiming(0);
            timer && clearInterval(timer);
            l.info('停止录像');
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
    );
  };

  const renderControls = () => {
    return (
      <View
        style={{
          flex: 0,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          style={{ padding: scaleSize(40) }}
          onPress={() => {
            setResult(undefined);
          }}>
          <Text style={{ fontSize: scaleSize(38), color: colorWhite }}>
            重拍
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: scaleSize(40) }} onPress={back}>
          <Text style={{ fontSize: scaleSize(38), color: colorWhite }}>
            使用
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPreview = () => {
    return (
      <>
        {result?.filePath?.endsWith('.mp4') ? (
          <Video
            source={{ uri: result?.filePath }} // Can be a URL or a local file.
            // ref={player} // Store reference
            // onBuffer={this.onBuffer} // Callback when remote video is buffering
            // onError={this.videoError} // Callback when video cannot be loaded
            style={{
              width: '100%',
              minHeight: 300,
              backgroundColor: 'black',
              alignSelf: 'center',
              flex: 1,
            }}
            resizeMode="contain"
          />
        ) : (
          <Image
            style={{
              width: '100%',
              minHeight: 300,
              backgroundColor: 'black',
              alignSelf: 'center',
              flex: 1,
            }}
            resizeMode="contain"
            source={{ uri: result?.filePath }}
          />
        )}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {result ? (
        renderPreview()
      ) : (
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
      )}

      {result ? renderControls() : renderTakeButton()}
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

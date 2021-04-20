import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import CosXmlReactNative from 'cos-xml-react-native-fix-upload';
import dayjs from 'dayjs';
import { l } from './logUtils';

export const COS_BUCKET_NAME = 'shyuntechtest';

CosXmlReactNative.initWithSessionCredentialCallback(
  {
    region: 'ap-shanghai',
  },
  async () => {
    const token = await AsyncStorage.getItem('token');
    l.info('开始请求获取临时凭证接口', dayjs().format('YYYY-MM-DD HH:mm:ss'));
    // 请求临时密钥
    try {
      const response = await axios.get(
        `http://fileservice.yuncloudtech.cn/api/app/files/tempSecretKey?FileSource=2&Bucket=${COS_BUCKET_NAME}&Prefix=`,
        {
          headers: {
            Authorization: token,
          },
          timeout: 10000,
        },
      );
      l.info('完成请求获取临时凭证接口', dayjs().format('YYYY-MM-DD HH:mm:ss'));
      l.info('凭证接口返回', response);
      const credentials = response.data.Credentials;
      const expiredTime = response.data.ExpiredTime;
      const sessionCredentials = {
        tmpSecretId: credentials.TmpSecretId,
        tmpSecretKey: credentials.TmpSecretKey,
        expiredTime: expiredTime,
        sessionToken: credentials.Token,
      };
      return sessionCredentials;
    } catch (e) {
      l.error('获取临时凭证失败');
      l.error(e);
      throw e;
    }
  },
);

export default CosXmlReactNative;

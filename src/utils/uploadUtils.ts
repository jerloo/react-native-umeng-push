import CosXmlReactNative from 'cos-xml-react-native';
import { getSession } from './sesstionUtils';

CosXmlReactNative.initWithSessionCredentialCallback(
  {
    region: 'ap-shanghai',
  },
  async () => {
    const session = await getSession();
    const prefix = session?.tenantName;
    // 请求临时密钥
    const response = await fetch(
      `http://81.68.221.56:44361/api/app/files/tempSecretKey?FileSource=2&Bucket=mobilereadapp&Prefix=${prefix}`,
    );
    const responseJson = await response.json();
    const credentials = responseJson.Credentials;
    const expiredTime = responseJson.ExpiredTime;
    const sessionCredentials = {
      tmpSecretId: credentials.TmpSecretId,
      tmpSecretKey: credentials.TmpSecretKey,
      expiredTime: expiredTime,
      sessionToken: credentials.Token,
    };
    return sessionCredentials;
  },
);

export default CosXmlReactNative;

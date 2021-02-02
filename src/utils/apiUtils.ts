import { ApiClient, AccessTokenProvider } from '../../apiclient/api';
import AsyncStorage from '@react-native-community/async-storage';

const provider: AccessTokenProvider = {
  get: async () => {
    const token = await AsyncStorage.getItem('token');
    return Promise.resolve(token || '');
  },
  set(token: string): Promise<void> {
    return AsyncStorage.setItem('token', token);
  },
};

export const api = new ApiClient(
  'http://mobilereadtransfer.yuncloudtech.cn',
  provider,
);

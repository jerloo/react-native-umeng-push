import { LoginInput, MeterReaderDto } from '../../apiclient/src/models';
import { api } from '../utils/apiUtils';
import { getSession, setSession } from '../utils/sesstionUtils';
import NetInfo from '@react-native-community/netinfo';
import { logger as Logger } from 'react-native-logs';
import AsyncStorage from '@react-native-community/async-storage';
const logger = Logger.createLogger();

const NETWORK_ERROR = '网络错误，请稍后再试';
const SERVER_ERROR = '服务器错误，请稍后再试';
const NO_NETWORK_ERROR = '请连接网络';
const USERNAME_PWD_ERROR = '用户名或密码错误';

interface ApiService {
  login(payload: LoginInput, autoLogin: boolean): Promise<string | boolean>;
  updateName(name: string): Promise<string | boolean>;
  updatePhoneNumber(phoneNumber: string): Promise<string | boolean>;
  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<string | boolean>;
  uploadLogFile(fileName: string, fileUrl: string): Promise<string | boolean>;
}

class OnlineApiService implements ApiService {
  async uploadLogFile(
    fileName: string,
    fileUrl: string,
  ): Promise<string | boolean> {
    try {
      const result = await api.logApi.apiAppMobileLogUploadMobileLogFilePost({
        deviceCode: '1-1-1-1',
        logFiles: [
          {
            logFileName: fileName,
            logFileUrl: fileUrl,
          },
        ],
      });
      if (result.status < 400) {
        return true;
      }
      return SERVER_ERROR;
    } catch {
      return SERVER_ERROR;
    }
  }

  async updateName(name: string): Promise<string | boolean> {
    try {
      const result = await api.chargeApi.apiAppChargeUserPut(name);
      console.log(result);
      if (result.status < 400) {
        const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
        if (infoResult.status < 400) {
          const session = await getSession();
          setSession({
            tenantName: session!!.tenantName,
            password: session!!.password,
            autoLogin: session!!.autoLogin,
            userInfo: infoResult.data,
          });
          return true;
        } else {
          return SERVER_ERROR;
        }
      }
      return SERVER_ERROR;
    } catch (e) {
      console.log(e);
      return SERVER_ERROR;
    }
  }

  async updatePhoneNumber(phoneNumber: string): Promise<string | boolean> {
    try {
      const result = await api.chargeApi.apiAppChargeUserPut(
        undefined,
        phoneNumber,
      );
      if (result.status < 400) {
        const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
        if (infoResult.status < 400) {
          const session = await getSession();
          setSession({
            tenantName: session!!.tenantName,
            password: session!!.password,
            autoLogin: session!!.autoLogin,
            userInfo: infoResult.data,
          });
          return true;
        } else {
          return SERVER_ERROR;
        }
      }
      return SERVER_ERROR;
    } catch {
      return SERVER_ERROR;
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<string | boolean> {
    try {
      const result = await api.chargeApi.apiAppChargeChangePasswordPut(
        currentPassword,
        newPassword,
      );
      if (result.status < 400) {
        return true;
      }
      return SERVER_ERROR;
    } catch {
      return SERVER_ERROR;
    }
  }

  async login(
    payload: LoginInput,
    autoLogin: boolean,
  ): Promise<string | boolean> {
    try {
      const loginResult = await api.loginApi.apiAppLoginLoginPost(payload);
      if (loginResult.status < 400) {
        console.log('login success', loginResult);
        const token =
          loginResult.data.tokenType + ' ' + loginResult.data.accessToken;
        const p1 = await api.provider.set(token);
        const p2 = AsyncStorage.setItem('token', token);
        const pall = await Promise.all([p1, p2]);
        const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
        if (infoResult.status < 400) {
          setSession({
            tenantName: payload.tenantName,
            password: payload?.passWord,
            autoLogin: autoLogin,
            userInfo: infoResult.data,
          });
          return true;
        } else {
          console.log(loginResult);
          return SERVER_ERROR;
        }
      } else {
        console.log(loginResult);
        return USERNAME_PWD_ERROR;
      }
    } catch (e) {
      console.log(e);
      return USERNAME_PWD_ERROR;
    }
  }
}

class OfflineApiService implements ApiService {
  async uploadLogFile(
    _fileName: string,
    _fileUrl: string,
  ): Promise<string | boolean> {
    return NO_NETWORK_ERROR;
  }
  updateName(_name: string): Promise<string | boolean> {
    return Promise.resolve(NO_NETWORK_ERROR);
  }
  updatePhoneNumber(_phoneNumber: string): Promise<string | boolean> {
    return Promise.resolve(NO_NETWORK_ERROR);
  }
  changePassword(
    _currentPassword: string,
    _newPassword: string,
  ): Promise<string | boolean> {
    return Promise.resolve(NO_NETWORK_ERROR);
  }
  async login(
    payload: LoginInput,
    _autoLogin: boolean,
  ): Promise<string | boolean> {
    const savedSession = await getSession();
    if (savedSession === null || savedSession.tenantName === '') {
      return NO_NETWORK_ERROR;
    }
    if (
      savedSession?.tenantName === payload.tenantName &&
      savedSession?.userInfo.userName === payload.userName &&
      savedSession?.password === payload.passWord
    ) {
      return true;
    }
    return USERNAME_PWD_ERROR;
  }
}

class CenterService implements ApiService {
  offline: OfflineApiService;
  online: OnlineApiService;

  constructor() {
    this.offline = new OfflineApiService();
    this.online = new OnlineApiService();
  }
  async uploadLogFile(
    fileName: string,
    fileUrl: string,
  ): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.uploadLogFile(fileName, fileUrl);
    }
    return this.offline.uploadLogFile(fileName, fileUrl);
  }
  async updateName(name: string): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.updateName(name);
    }
    return this.offline.updateName(name);
  }
  async updatePhoneNumber(phoneNumber: string): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.updatePhoneNumber(phoneNumber);
    }
    return this.offline.updatePhoneNumber(phoneNumber);
  }
  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.changePassword(currentPassword, newPassword);
    }
    return this.offline.changePassword(currentPassword, newPassword);
  }

  async login(
    payload: LoginInput,
    autoLogin: boolean,
  ): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.login(payload, autoLogin);
    }
    return this.offline.login(payload, autoLogin);
  }
}

export default new CenterService();

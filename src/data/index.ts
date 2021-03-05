import {
  LoginInput,
  PdaReadDataDto,
  PdaReadStateDto,
  ReadingDataDto,
} from '../../apiclient/src/models';
import { api } from '../utils/apiUtils';
import { getSession, setSession } from '../utils/sesstionUtils';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-community/async-storage';
import db from './database';
import { PdaMeterBookDtoHolder } from './holders';

export const NETWORK_ERROR = '网络错误，请稍后再试';
export const SERVER_ERROR = '服务器错误，请稍后再试';
export const NO_NETWORK_ERROR = '请连接网络';
export const USERNAME_PWD_ERROR = '用户名或密码错误';

interface ApiService {
  login(payload: LoginInput, autoLogin: boolean): Promise<string | boolean>;
  logout(): Promise<string | boolean>;
  updateName(name: string): Promise<string | boolean>;
  updatePhoneNumber(phoneNumber: string): Promise<string | boolean>;
  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<string | boolean>;
  uploadLogFile(fileName: string, fileUrl: string): Promise<string | boolean>;
  getBookList(): Promise<PdaMeterBookDtoHolder[] | string>;
  getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[] | string>;
  getReadStates(): Promise<PdaReadStateDto[] | string>;
}

class OnlineApiService implements ApiService {
  async getReadStates(): Promise<string | PdaReadStateDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeReadStatesGet();
      if (result.status < 400) {
        console.log('获取抄表状态', (result.data.items || []).length);
        return result.data.items || [];
      }
      return SERVER_ERROR;
    } catch (e) {
      console.log(e);
      return SERVER_ERROR;
    }
  }
  async getBookDataByIds(ids: number[]): Promise<string | PdaReadDataDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeReadDataByBookIdsPost({
        bookIds: ids,
      });
      if (result.status < 400) {
        console.log('获取测本数量', (result.data.items || []).length);
        return result.data.items || [];
      }
      return SERVER_ERROR;
    } catch (e) {
      console.log(e);
      return SERVER_ERROR;
    }
  }

  async getBookList(): Promise<string | PdaMeterBookDtoHolder[]> {
    try {
      const result = await api.chargeApi.apiAppChargeBookListGet();
      if (result.status < 400) {
        return result.data.items;
      }
      return SERVER_ERROR;
    } catch (e) {
      console.log(e);
      return SERVER_ERROR;
    }
  }

  async logout(): Promise<string | boolean> {
    try {
      const result = await api.loginApi.apiAppLoginLogoutPost();
      if (result.status < 400) {
        return true;
      }
      return SERVER_ERROR;
    } catch (e) {
      console.log(e);
      return SERVER_ERROR;
    }
  }

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
        const token =
          loginResult.data.tokenType + ' ' + loginResult.data.accessToken;
        console.log('token', token);
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
  async getBookDataByIds(ids: number[]): Promise<string | PdaReadDataDto[]> {
    return db.getBookDataByIds(ids);
  }

  async getBookList(): Promise<string | PdaMeterBookDtoHolder[]> {
    return db.getBooks();
  }

  async logout(): Promise<string | boolean> {
    return true;
  }

  async uploadLogFile(
    _fileName: string,
    _fileUrl: string,
  ): Promise<string | boolean> {
    return NO_NETWORK_ERROR;
  }

  async updateName(_name: string): Promise<string | boolean> {
    return NO_NETWORK_ERROR;
  }

  async updatePhoneNumber(_phoneNumber: string): Promise<string | boolean> {
    return NO_NETWORK_ERROR;
  }

  async changePassword(
    _currentPassword: string,
    _newPassword: string,
  ): Promise<string | boolean> {
    return NO_NETWORK_ERROR;
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

  async getReadStates(): Promise<string | PdaReadStateDto[]> {
    throw new Error('Method not implemented.');
  }

  async getBookDataByIds(ids: number[]): Promise<string | PdaReadDataDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      const result = await this.online.getBookDataByIds(ids);
      if (result instanceof String) {
        return result;
      }
      try {
        await db.saveReadData(result as PdaReadDataDto[]);
      } catch (e) {
        console.log(e);
        console.log('下载保存测本数据失败');
      }
      try {
        await db.markBookDownloaded(ids);
      } catch (e) {
        console.log(e);
        console.log('更新下载完成状态是失败');
      }

      return result;
    }
    return this.offline.getBookDataByIds(ids);
  }

  async getBookList(): Promise<string | PdaMeterBookDtoHolder[]> {
    const localResult = await this.offline.getBookList();
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      const result = await this.online.getBookList();
      if (result instanceof String) {
        return result;
      }
      if (localResult.length === 0) {
        console.log('本地抄表任务为空，直接保存抄表任务');
        await db.saveBooks(result as PdaMeterBookDtoHolder[]);
        return result;
      } else {
        const adds: PdaMeterBookDtoHolder[] = (result as PdaMeterBookDtoHolder[]).filter(
          (value) => {
            return (localResult as PdaMeterBookDtoHolder[]).find(
              (it) => it.bookId === value.bookId,
            );
          },
        );
        console.log('本地抄表任务有数据, 保存新增数据');
        await db.saveBooks(adds);
      }
    }
    return localResult;
  }

  async logout(): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.logout();
    }
    return this.offline.logout();
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

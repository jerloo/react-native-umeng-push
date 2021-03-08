import {
  LoginInput,
  PdaReadDataDto,
  PdaReadStateDto,
  PdaCustDto,
} from '../../apiclient/src/models';
import NetInfo from '@react-native-community/netinfo';
import db from './database';
import { PdaMeterBookDtoHolder } from './holders';
import ApiService from './apiService';
import OfflineApiService from './offline';
import OnlineApiService from './online';

class CenterService implements ApiService {
  offline: OfflineApiService;
  online: OnlineApiService;

  constructor() {
    this.offline = new OfflineApiService();
    this.online = new OnlineApiService();
  }

  async getReadingMonth(): Promise<string | number> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getReadingMonth();
    }
    return this.offline.getReadingMonth();
  }

  async getCustDetails(custIds: number[]): Promise<string | PdaCustDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getCustDetails(custIds);
    }
    return this.offline.getCustDetails(custIds);
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

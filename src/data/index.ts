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

  async getReadingMonth(): Promise<number | null> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getReadingMonth();
    }
    return this.offline.getReadingMonth();
  }

  async getCustDetails(custIds: number[]): Promise<PdaCustDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getCustDetails(custIds);
    }
    return this.offline.getCustDetails(custIds);
  }

  async getReadStates(): Promise<PdaReadStateDto[]> {
    throw new Error('Method not implemented.');
  }

  async getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      const result = await this.online.getBookDataByIds(ids);
      await db.deleteReadData(ids);
      await db.saveReadData(result as PdaReadDataDto[]);
      await db.markBookDownloaded(ids);
      return result;
    }
    return this.offline.getBookDataByIds(ids);
  }

  async getBookList(): Promise<PdaMeterBookDtoHolder[]> {
    const localResult = await this.offline.getBookList();
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      const result = await this.online.getBookList();
      if (localResult.length === 0) {
        console.log('本地抄表任务为空，直接保存抄表任务');
        await db.saveBooks(result as PdaMeterBookDtoHolder[]);
        return result;
      } else {
        // const adds: PdaMeterBookDtoHolder[] = (result as PdaMeterBookDtoHolder[]).filter(
        //   (value) => {
        //     return (localResult as PdaMeterBookDtoHolder[]).find(
        //       (it) => it.bookId === value.bookId,
        //     );
        //   },
        // );
        // console.log('本地抄表任务有数据, 保存新增数据');
        // await db.saveBooks(adds);
        console.log('本地抄表任务不为空，删除本地数据，保存抄表任务');
        await db.deleteBooks();
        await db.saveBooks(result);
        return result;
      }
    }
    return localResult;
  }

  async logout(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.logout();
    }
    return this.offline.logout();
  }

  async uploadLogFile(fileName: string, fileUrl: string): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.uploadLogFile(fileName, fileUrl);
    }
    return this.offline.uploadLogFile(fileName, fileUrl);
  }

  async updateName(name: string): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.updateName(name);
    }
    return this.offline.updateName(name);
  }

  async updatePhoneNumber(phoneNumber: string): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.updatePhoneNumber(phoneNumber);
    }
    return this.offline.updatePhoneNumber(phoneNumber);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.changePassword(currentPassword, newPassword);
    }
    return this.offline.changePassword(currentPassword, newPassword);
  }

  async login(payload: LoginInput, autoLogin: boolean): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.login(payload, autoLogin);
    }
    return this.offline.login(payload, autoLogin);
  }
}

export default new CenterService();

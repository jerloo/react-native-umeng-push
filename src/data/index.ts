import {
  LoginInput,
  PdaReadDataDto,
  PdaReadStateDto,
  PdaCustDto,
  PdaReadingCollectDto,
  MeterReaderDto,
  PdaCustListDto,
  PdaCalcBudgetAmountInput,
  PdaArrearageInputDto,
  SysSettingDto,
  PdaArrearageChargesInputDto,
  PdaChargeListDto,
  PdaArrearageDtoPagedResultDto,
  PdaPaymentInput,
  PdaPaymentCollectInput,
  PdaPaymentCollectDto,
  PdaPaySubtotalsDto,
} from '../../apiclient/src/models';
import NetInfo from '@react-native-community/netinfo';
import db from './database';
import { PdaMeterBookDtoHolder } from './holders';
import ApiService from './apiService';
import OfflineApiService from './offline';
import OnlineApiService from './online';
import { setBillMonth } from '../utils/billMonthUtils';

class CenterService implements ApiService {
  offline: OfflineApiService;
  online: OnlineApiService;

  constructor() {
    this.offline = new OfflineApiService();
    this.online = new OnlineApiService();
  }

  async getPaymentSubtotal(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaySubtotalsDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getPaymentSubtotal(input);
    }
    return this.offline.getPaymentSubtotal(input);
  }

  async getPaymentCollect(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaymentCollectDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getPaymentCollect(input);
    }
    return this.offline.getPaymentCollect(input);
  }

  async getAlipayQrCodeUrl(custCode: string): Promise<string> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getAlipayQrCodeUrl(custCode);
    }
    return this.offline.getAlipayQrCodeUrl(custCode);
  }

  async getWechatQrCodeUrl(custCode: string): Promise<string> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getWechatQrCodeUrl(custCode);
    }
    return this.offline.getWechatQrCodeUrl(custCode);
  }

  async getCashPaymentDetails(input: PdaPaymentInput): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getCashPaymentDetails(input);
    }
    return this.offline.getCashPaymentDetails(input);
  }

  async getArrearageList(
    input: PdaArrearageInputDto,
  ): Promise<PdaArrearageDtoPagedResultDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getArrearageList(input);
    }
    return this.offline.getArrearageList(input);
  }

  async getSystemSettings(): Promise<SysSettingDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getSystemSettings();
    }
    return this.offline.getSystemSettings();
  }

  async getArrearageChargeList(
    input: PdaArrearageChargesInputDto,
  ): Promise<PdaChargeListDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getArrearageChargeList(input);
    }
    return this.offline.getArrearageChargeList(input);
  }

  async calcBudgetAmount(input: PdaCalcBudgetAmountInput): Promise<number> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.calcBudgetAmount(input);
    }
    return this.offline.calcBudgetAmount(input);
  }

  async homeQuery(key: string): Promise<PdaCustListDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.homeQuery(key);
    }
    return this.offline.homeQuery(key);
  }

  async getAllPdaUsers(): Promise<MeterReaderDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getAllPdaUsers();
    }
    return this.offline.getAllPdaUsers();
  }

  async getReadingCollect(
    opId: string,
    billMonth: number,
  ): Promise<PdaReadingCollectDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getReadingCollect(opId, billMonth);
    }
    return this.offline.getReadingCollect(opId, billMonth);
  }

  async getReadingMonth(): Promise<number | null> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return await this.online.getReadingMonth();
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
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.getReadStates();
    }
    return this.offline.getReadStates();
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

const center = new CenterService();
export default center;

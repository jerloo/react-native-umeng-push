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
  UploadReadingDataDto,
  UploadReadingFileDto,
  PdaReadDataDtoListResultDto,
  PdaMeterReaderDto,
  ReadingDataDto,
  MeterBookDto,
  ReadingMonthDto,
} from '../../apiclient/src/models';
import NetInfo from '@react-native-community/netinfo';
import db from './database';
import { PdaMeterBookDtoHolder } from './holders';
import { ApiService } from './apiService';
import OfflineApiService from './offline';
import OnlineApiService from './online';
import { CustInfoModifyInputDto } from '../../apiclient/src/models/cust-info-modify-input-dto';
import { BookSortIndexDto } from '../../apiclient/src/models/book-sort-index-dto';
import { l } from '../utils/logUtils';

class CenterService implements ApiService {
  offline: OfflineApiService;
  online: OnlineApiService;

  constructor() {
    this.offline = new OfflineApiService();
    this.online = new OnlineApiService();
  }

  async getBookListByUserId(id: string): Promise<MeterBookDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getBookListByUserId(id);
    }
    return this.offline.getBookListByUserId(id);
  }

  async makeOut(input: ReadingDataDto): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.makeOut(input);
    }
    return this.offline.makeOut(input);
  }

  async getUserInfo(): Promise<PdaMeterReaderDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getUserInfo();
    }
    return this.offline.getUserInfo();
  }

  async sync(deviceId: string): Promise<PdaReadDataDtoListResultDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      const result = await this.online.sync(deviceId);
      l.info(`拉取同步数据 ${result.items?.length || 0}`, result.items);
      await db.updateReadData(result.items || []);
      l.info('同步数据', result.items || []);
      return result;
    }
    return this.offline.sync(deviceId);
  }

  async uploadAttachments(input: UploadReadingFileDto): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.uploadAttachments(input);
    }
    return this.offline.uploadAttachments(input);
  }

  async updateBookSort(input: BookSortIndexDto[]): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.updateBookSort(input);
    }
    return this.offline.updateBookSort(input);
  }

  async uploadReadingData(input: UploadReadingDataDto): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.uploadReadingData(input);
    }
    return this.offline.uploadReadingData(input);
  }

  async updateCustInfo(input: CustInfoModifyInputDto): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.updateCustInfo(input);
    }
    return this.offline.updateCustInfo(input);
  }

  async getPaymentSubtotal(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaySubtotalsDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getPaymentSubtotal(input);
    }
    return this.offline.getPaymentSubtotal(input);
  }

  async getPaymentCollect(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaymentCollectDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getPaymentCollect(input);
    }
    return this.offline.getPaymentCollect(input);
  }

  async getAlipayQrCodeUrl(custCode: string): Promise<string> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getAlipayQrCodeUrl(custCode);
    }
    return this.offline.getAlipayQrCodeUrl(custCode);
  }

  async getWechatQrCodeUrl(custCode: string): Promise<string> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getWechatQrCodeUrl(custCode);
    }
    return this.offline.getWechatQrCodeUrl(custCode);
  }

  async getCashPaymentDetails(
    custId: number,
    input: PdaPaymentInput,
  ): Promise<void> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      await this.online.getCashPaymentDetails(custId, input);
      await db.markPaidAfterCashPayment(custId);
    }
    return this.offline.getCashPaymentDetails(custId, input);
  }

  async getArrearageList(
    input: PdaArrearageInputDto,
  ): Promise<PdaArrearageDtoPagedResultDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getArrearageList(input);
    }
    return this.offline.getArrearageList(input);
  }

  async getSystemSettings(): Promise<SysSettingDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getSystemSettings();
    }
    return this.offline.getSystemSettings();
  }

  async getArrearageChargeList(
    input: PdaArrearageChargesInputDto,
  ): Promise<PdaChargeListDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getArrearageChargeList(input);
    }
    return this.offline.getArrearageChargeList(input);
  }

  async calcBudgetAmount(input: PdaCalcBudgetAmountInput): Promise<number> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.calcBudgetAmount(input);
    }
    return this.offline.calcBudgetAmount(input);
  }

  async homeQuery(key: string): Promise<PdaCustListDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.homeQuery(key);
    }
    return this.offline.homeQuery(key);
  }

  async getAllPdaUsers(): Promise<MeterReaderDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getAllPdaUsers();
    }
    return this.offline.getAllPdaUsers();
  }

  async getReadingCollect(
    opId: string,
    billMonth: number,
  ): Promise<PdaReadingCollectDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getReadingCollect(opId, billMonth);
    }
    return this.offline.getReadingCollect(opId, billMonth);
  }

  async getReadingMonth(): Promise<ReadingMonthDto | null> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return await this.online.getReadingMonth();
    }
    return this.offline.getReadingMonth();
  }

  async getCustDetails(custIds: number[]): Promise<PdaCustDto> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getCustDetails(custIds);
    }
    return this.offline.getCustDetails(custIds);
  }

  async getReadStates(): Promise<PdaReadStateDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.getReadStates();
    }
    return this.offline.getReadStates();
  }

  async getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[]> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
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
    if (netInfo.isConnected === true) {
      const result = await this.online.getBookList();
      if (localResult.length === 0) {
        l.debug('本地抄表任务为空，直接保存抄表任务');
        await db.saveBooks(result as PdaMeterBookDtoHolder[]);
        return result;
      } else {
        const remoteItems = result as PdaMeterBookDtoHolder[];
        const localItems = localResult as PdaMeterBookDtoHolder[];
        const adds = remoteItems.filter((value) => {
          return !localItems.find((it) => it.bookId === value.bookId);
        });
        if (adds.length > 0) {
          l.debug('本地抄表任务有数据, 保存新增数据');
          await db.saveBooks(adds);
        }

        const removeItems = localItems.filter((value) => {
          return !remoteItems.find((it) => it.bookId === value.bookId);
        });
        if (removeItems.length > 0) {
          l.debug('远程抄表任务有删除, 删除本地抄表任务');
          await db.deleteBookByIds(removeItems.map((it) => it.bookId));
        }
        return result;
      }
    }
    return localResult;
  }

  async logout(): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.logout();
    }
    return this.offline.logout();
  }

  async uploadLogFile(fileName: string, fileUrl: string): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.uploadLogFile(fileName, fileUrl);
    }
    return this.offline.uploadLogFile(fileName, fileUrl);
  }

  async updateName(name: string): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.updateName(name);
    }
    return this.offline.updateName(name);
  }

  async updatePhoneNumber(phoneNumber: string): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.updatePhoneNumber(phoneNumber);
    }
    return this.offline.updatePhoneNumber(phoneNumber);
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.changePassword(currentPassword, newPassword);
    }
    return this.offline.changePassword(currentPassword, newPassword);
  }

  async login(payload: LoginInput, autoLogin: boolean): Promise<boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected === true) {
      return this.online.login(payload, autoLogin);
    }
    return this.offline.login(payload, autoLogin);
  }
}

const center = new CenterService();
export default center;

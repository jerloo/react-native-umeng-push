import {
  LoginInput,
  MeterReaderDto,
  PdaArrearageChargesInputDto,
  PdaArrearageDtoPagedResultDto,
  PdaArrearageInputDto,
  PdaCalcBudgetAmountInput,
  PdaChargeListDto,
  PdaCustDto,
  PdaCustListDto,
  PdaMeterReaderDto,
  PdaPaymentCollectDto,
  PdaPaymentCollectInput,
  PdaPaymentInput,
  PdaPaySubtotalsDto,
  PdaReadDataDto,
  PdaReadDataDtoListResultDto,
  PdaReadingCollectDto,
  PdaReadStateDto,
  SysSettingDto,
  UploadReadingDataDto,
  UploadReadingFileDto,
} from '../../apiclient/src/models';
import { BookSortIndexDto } from '../../apiclient/src/models/book-sort-index-dto';
import { CustInfoModifyInputDto } from '../../apiclient/src/models/cust-info-modify-input-dto';
import { getBillMonth } from '../utils/billMonthUtils';
import { getSession } from '../utils/sesstionUtils';
import ApiService, { NO_NETWORK_ERROR, USERNAME_PWD_ERROR } from './apiService';
import db from './database';
import { PdaMeterBookDtoHolder } from './holders';

export default class OfflineApiService implements ApiService {
  async getUserInfo(): Promise<PdaMeterReaderDto> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async sync(_deviceId: string): Promise<PdaReadDataDtoListResultDto> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async uploadAttachments(_input: UploadReadingFileDto): Promise<void> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async updateBookSort(_input: BookSortIndexDto[]): Promise<void> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async uploadReadingData(_input: UploadReadingDataDto): Promise<void> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async updateCustInfo(_input: CustInfoModifyInputDto): Promise<void> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getPaymentSubtotal(
    _input: PdaPaymentCollectInput,
  ): Promise<PdaPaySubtotalsDto> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getPaymentCollect(
    _input: PdaPaymentCollectInput,
  ): Promise<PdaPaymentCollectDto> {
    throw new Error(NO_NETWORK_ERROR);
  }
  async getAlipayQrCodeUrl(_custCode: string): Promise<string> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getWechatQrCodeUrl(_custCode: string): Promise<string> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getCashPaymentDetails(_input: PdaPaymentInput): Promise<void> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getArrearageList(
    _input: PdaArrearageInputDto,
  ): Promise<PdaArrearageDtoPagedResultDto> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getArrearageChargeList(
    _input: PdaArrearageChargesInputDto,
  ): Promise<PdaChargeListDto[]> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getSystemSettings(): Promise<SysSettingDto[]> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async calcBudgetAmount(_input: PdaCalcBudgetAmountInput): Promise<number> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async homeQuery(_key: string): Promise<PdaCustListDto[]> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getAllPdaUsers(): Promise<MeterReaderDto[]> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getReadingCollect(
    _opId: string,
    _billMonth: number,
  ): Promise<PdaReadingCollectDto[]> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async getReadStates(): Promise<PdaReadStateDto[]> {
    throw new Error('Method not implemented.');
  }

  async getCustDetails(_custIds: number[]): Promise<PdaCustDto> {
    throw new Error('Method not implemented.');
  }

  async getReadingMonth(): Promise<number | null> {
    return await getBillMonth();
  }

  async getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[]> {
    return db.getBookDataByBookIds(ids);
  }

  async getBookList(): Promise<PdaMeterBookDtoHolder[]> {
    return db.getBooks();
  }

  async logout(): Promise<boolean> {
    return true;
  }

  async uploadLogFile(_fileName: string, _fileUrl: string): Promise<boolean> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async updateName(_name: string): Promise<boolean> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async updatePhoneNumber(_phoneNumber: string): Promise<boolean> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async changePassword(
    _currentPassword: string,
    _newPassword: string,
  ): Promise<boolean> {
    throw new Error(NO_NETWORK_ERROR);
  }

  async login(payload: LoginInput, _autoLogin: boolean): Promise<boolean> {
    const savedSession = await getSession();
    if (savedSession === null || savedSession.tenantName === '') {
      throw new Error(NO_NETWORK_ERROR);
    }
    if (
      savedSession?.tenantName === payload.tenantName &&
      savedSession?.userInfo.userName === payload.userName &&
      savedSession?.password === payload.passWord
    ) {
      return true;
    }
    throw new Error(USERNAME_PWD_ERROR);
  }
}

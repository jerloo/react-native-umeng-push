import {
  LoginInput,
  MeterBookDto,
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
  ReadingDataDto,
  ReadingMonthDto,
  SysSettingDto,
  UploadReadingDataDto,
  UploadReadingFileDto,
} from '../../apiclient/src/models';
import { BookSortIndexDto } from '../../apiclient/src/models/book-sort-index-dto';
import { CustInfoModifyInputDto } from '../../apiclient/src/models/cust-info-modify-input-dto';
import { PdaMeterBookDtoHolder } from './holders';

export interface ApiService {
  login(payload: LoginInput, autoLogin: boolean): Promise<boolean>;
  logout(): Promise<boolean>;
  updateName(name: string): Promise<boolean>;
  updatePhoneNumber(phoneNumber: string): Promise<boolean>;
  changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean>;
  uploadLogFile(fileName: string, fileUrl: string): Promise<boolean>;
  getBookList(userId: string): Promise<PdaMeterBookDtoHolder[]>;
  getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[]>;
  getReadStates(): Promise<PdaReadStateDto[]>;
  getCustDetails(custIds: number[]): Promise<PdaCustDto>;
  getReadingMonth(): Promise<ReadingMonthDto | null>;
  getReadingCollect(
    opId: string,
    billMonth: number,
  ): Promise<PdaReadingCollectDto[]>;
  getAllPdaUsers(): Promise<MeterReaderDto[]>;
  homeQuery(key: string): Promise<PdaCustListDto[]>;
  calcBudgetAmount(input: PdaCalcBudgetAmountInput): Promise<number>;
  getSystemSettings(): Promise<SysSettingDto[]>;
  getArrearageChargeList(
    input: PdaArrearageChargesInputDto,
  ): Promise<PdaChargeListDto[]>;
  getArrearageList(
    input: PdaArrearageInputDto,
  ): Promise<PdaArrearageDtoPagedResultDto>;
  getAlipayQrCodeUrl(custCode: string): Promise<string>;
  getWechatQrCodeUrl(custCode: string): Promise<string>;
  getCashPaymentDetails(custId: number, input: PdaPaymentInput): Promise<void>;
  getPaymentCollect(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaymentCollectDto>;
  getPaymentSubtotal(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaySubtotalsDto>;
  updateCustInfo(input: CustInfoModifyInputDto): Promise<void>;
  uploadReadingData(input: UploadReadingDataDto): Promise<void>;
  updateBookSort(input: BookSortIndexDto[]): Promise<void>;
  uploadAttachments(input: UploadReadingFileDto): Promise<void>;
  sync(deviceId: string): Promise<PdaReadDataDtoListResultDto>;
  getUserInfo(): Promise<PdaMeterReaderDto>;
  makeOut(input: ReadingDataDto): Promise<void>;
  getBookListByUserId(id: string): Promise<MeterBookDto[]>;
  getPaymentSubtotalDetails(subTotalId: number): Promise<PdaChargeListDto[]>;
}

export const NETWORK_ERROR = '网络错误，请稍后再试';
export const SERVER_ERROR = '请连接网络';
export const NO_NETWORK_ERROR = '请连接网络';
export const USERNAME_PWD_ERROR = '用户名或密码错误';

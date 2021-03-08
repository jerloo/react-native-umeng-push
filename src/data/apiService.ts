import {
  LoginInput,
  PdaCustDto,
  PdaReadDataDto,
  PdaReadStateDto,
} from '../../apiclient/src/models';
import { PdaMeterBookDtoHolder } from './holders';

export default interface ApiService {
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
  getCustDetails(custIds: number[]): Promise<PdaCustDto | string>;
  getReadingMonth(): Promise<number | string>;
}

export const NETWORK_ERROR = '网络错误，请稍后再试';
export const SERVER_ERROR = '服务器错误，请稍后再试';
export const NO_NETWORK_ERROR = '请连接网络';
export const USERNAME_PWD_ERROR = '用户名或密码错误';

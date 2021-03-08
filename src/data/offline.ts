import {
  LoginInput,
  PdaCustDto,
  PdaReadDataDto,
  PdaReadStateDto,
} from '../../apiclient/src/models';
import { getBillMonth } from '../utils/billMonthUtils';
import { getSession } from '../utils/sesstionUtils';
import ApiService, { NO_NETWORK_ERROR, USERNAME_PWD_ERROR } from './apiService';
import db from './database';
import { PdaMeterBookDtoHolder } from './holders';

export default class OfflineApiService implements ApiService {
  async getReadStates(): Promise<string | PdaReadStateDto[]> {
    throw new Error('Method not implemented.');
  }

  getCustDetails(custIds: number[]): Promise<string | PdaCustDto> {
    throw new Error('Method not implemented.');
  }

  async getReadingMonth(): Promise<string | number> {
    return (await getBillMonth()) || '错误';
  }

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

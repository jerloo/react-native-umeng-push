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
    return db.getBookDataByIds(ids);
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

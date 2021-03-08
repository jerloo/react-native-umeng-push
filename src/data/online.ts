import {
  LoginInput,
  MeterReaderDto,
  PdaCustDto,
  PdaReadDataDto,
  PdaReadingCollectDto,
  PdaReadStateDto,
} from '../../apiclient/src/models';
import { getSession, setSession } from '../utils/sesstionUtils';
import ApiService, { SERVER_ERROR, USERNAME_PWD_ERROR } from './apiService';
import { PdaMeterBookDtoHolder } from './holders';
import { api } from '../utils/apiUtils';
import AsyncStorage from '@react-native-community/async-storage';

export default class OnlineApiService implements ApiService {
  async getAllPdaUsers(): Promise<MeterReaderDto[]> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentPdaUserGet();
      if (result.status < 400) {
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getReadingCollect(
    opId: string,
    billMonth: number,
  ): Promise<PdaReadingCollectDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeGetReadingCollectPost({
        meterReadingId: opId,
        billMonth: billMonth,
      });
      if (result.status < 400) {
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getReadingMonth(): Promise<number | null> {
    try {
      const result = await api.chargeApi.apiAppChargeReadingMonthGet();
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getCustDetails(custIds: number[]): Promise<PdaCustDto> {
    try {
      const result = await api.chargeApi.apiAppChargeCustDetailsByCustIdPost({
        custId: custIds,
      });
      if (result.status < 400) {
        console.log('获取客户详情', (result.data.items || []).length);
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getReadStates(): Promise<PdaReadStateDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeReadStatesGet();
      if (result.status < 400) {
        console.log('获取抄表状态', (result.data.items || []).length);
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeReadDataByBookIdsPost({
        bookIds: ids,
      });
      if (result.status < 400) {
        console.log('获取测本数量', (result.data.items || []).length);
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getBookList(): Promise<PdaMeterBookDtoHolder[]> {
    try {
      const result = await api.chargeApi.apiAppChargeBookListGet();
      if (result.status < 400) {
        return result.data.items;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async logout(): Promise<boolean> {
    try {
      const result = await api.loginApi.apiAppLoginLogoutPost();
      if (result.status < 400) {
        return true;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async uploadLogFile(fileName: string, fileUrl: string): Promise<boolean> {
    try {
      const result = await api.logApi.apiAppMobileReadingUploadMobileLogFilePost(
        {
          deviceCode: '1-1-1-1',
          logFiles: [
            {
              logFileName: fileName,
              logFileUrl: fileUrl,
            },
          ],
        },
      );
      if (result.status < 400) {
        return true;
      }
      throw new Error(SERVER_ERROR);
    } catch {
      throw new Error(SERVER_ERROR);
    }
  }

  async updateName(name: string): Promise<boolean> {
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
          throw new Error(SERVER_ERROR);
        }
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      console.log(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async updatePhoneNumber(phoneNumber: string): Promise<boolean> {
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
          throw new Error(SERVER_ERROR);
        }
      }
      throw new Error(SERVER_ERROR);
    } catch {
      throw new Error(SERVER_ERROR);
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      const result = await api.chargeApi.apiAppChargeChangePasswordPut(
        currentPassword,
        newPassword,
      );
      if (result.status < 400) {
        return true;
      }
      throw new Error(SERVER_ERROR);
    } catch {
      throw new Error(SERVER_ERROR);
    }
  }

  async login(payload: LoginInput, autoLogin: boolean): Promise<boolean> {
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
          throw new Error(SERVER_ERROR);
        }
      } else {
        console.log(loginResult);
        throw new Error(USERNAME_PWD_ERROR);
      }
    } catch (e) {
      console.log(e);
      throw new Error(USERNAME_PWD_ERROR);
    }
  }
}

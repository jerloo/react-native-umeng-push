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
import { getSession, setSession } from '../utils/sesstionUtils';
import { ApiService, SERVER_ERROR, USERNAME_PWD_ERROR } from './apiService';
import { PdaMeterBookDtoHolder } from './holders';
import { api } from '../utils/apiUtils';
import AsyncStorage from '@react-native-community/async-storage';
import { CustInfoModifyInputDto } from '../../apiclient/src/models/cust-info-modify-input-dto';
import DeviceInfo from 'react-native-device-info';
import { BookSortIndexDto } from '../../apiclient/src/models/book-sort-index-dto';
import { l } from '../utils/logUtils';

export default class OnlineApiService implements ApiService {
  async getBookListByUserId(id: string): Promise<MeterBookDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeMeterBookListGet(id);
      if (result.status < 400) {
        return result.data.items;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async makeOut(input: ReadingDataDto): Promise<void> {
    try {
      const result = await api.mobileReadingApi.apiAppMobileReadingMakeOutPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getUserInfo(): Promise<PdaMeterReaderDto> {
    try {
      const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
      if (infoResult.status < 400) {
        const session = await getSession();
        if (session) {
          await setSession({
            ...session,
            userInfo: infoResult.data,
          });
        }
        return infoResult.data;
      } else {
        throw new Error(SERVER_ERROR);
      }
    } catch (e) {
      l.error(e);
      throw new Error(USERNAME_PWD_ERROR);
    }
  }

  async sync(deviceId: string): Promise<PdaReadDataDtoListResultDto> {
    try {
      const result = await api.chargeApi.apiAppChargeSynchronousDataListGet(
        deviceId,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async uploadAttachments(input: UploadReadingFileDto): Promise<void> {
    try {
      const result = await api.mobileReadingApi.apiAppMobileReadingUploadReadingFilePost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async updateBookSort(input: BookSortIndexDto[]): Promise<void> {
    try {
      const result = await api.mobileReadingApi.apiAppMobileReadingUpdateBookSortIndexPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async uploadReadingData(input: UploadReadingDataDto): Promise<void> {
    try {
      const result = await api.mobileReadingApi.apiAppMobileReadingUploadReadingDatePost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async updateCustInfo(input: CustInfoModifyInputDto): Promise<void> {
    try {
      const result = await api.chargeApi.apiAppChargeCustInfoModifyPost(input);
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getPaymentSubtotal(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaySubtotalsDto> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentGetPaymentSubtotalPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getPaymentCollect(
    input: PdaPaymentCollectInput,
  ): Promise<PdaPaymentCollectDto> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentGetPaymentCollectPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getAlipayQrCodeUrl(custCode: string): Promise<string> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentPaymentByAlipayPost(
        custCode,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getWechatQrCodeUrl(custCode: string): Promise<string> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentPaymentByWeChatPost(
        custCode,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getCashPaymentDetails(
    custId: number,
    input: PdaPaymentInput,
  ): Promise<void> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentPaymentByCashPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getArrearageList(
    input: PdaArrearageInputDto,
  ): Promise<PdaArrearageDtoPagedResultDto> {
    try {
      const result = await api.chargeApi.apiAppChargeGetArrearageListPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getArrearageChargeList(
    input: PdaArrearageChargesInputDto,
  ): Promise<PdaChargeListDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeGetArrearageChargeListPost(
        input,
      );
      if (result.status < 400) {
        return result.data.items;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getSystemSettings(): Promise<SysSettingDto[]> {
    try {
      const result = await api.mobileSystemApi.apiAppMobileSystemSettingsGet();
      if (result.status < 400) {
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async calcBudgetAmount(input: PdaCalcBudgetAmountInput): Promise<number> {
    try {
      const result = await api.mobileReadingApi.apiAppMobileReadingCalcBudgetAmountPost(
        input,
      );
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }
  async homeQuery(key: string): Promise<PdaCustListDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeCustListGet(key);
      if (result.status < 400) {
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getAllPdaUsers(): Promise<MeterReaderDto[]> {
    try {
      const result = await api.paymentApi.apiAppMobilePaymentPdaUserGet();
      if (result.status < 400) {
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
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
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getReadingMonth(): Promise<ReadingMonthDto | null> {
    try {
      const result = await api.chargeApi.apiAppChargeReadingMonthGet();
      if (result.status < 400) {
        return result.data;
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getCustDetails(custIds: number[]): Promise<PdaCustDto> {
    try {
      const result = await api.chargeApi.apiAppChargeCustDetailsByCustIdPost({
        custId: custIds,
      });
      if (result.status < 400) {
        l.info('获取客户详情', (result.data.items || []).length);
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getReadStates(): Promise<PdaReadStateDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeReadStatesGet();
      if (result.status < 400) {
        l.info('获取抄表状态', (result.data.items || []).length);
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async getBookDataByIds(ids: number[]): Promise<PdaReadDataDto[]> {
    try {
      const result = await api.chargeApi.apiAppChargeReadDataByBookIdsPost({
        deviceCode: DeviceInfo.getUniqueId(),
        bookIds: ids,
      });
      if (result.status < 400) {
        l.info('获取测本数量', (result.data.items || []).length);
        return result.data.items || [];
      }
      throw new Error(SERVER_ERROR);
    } catch (e) {
      l.error(e);
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
      l.error(e);
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
      l.error(e);
      throw new Error(SERVER_ERROR);
    }
  }

  async uploadLogFile(fileName: string, fileUrl: string): Promise<boolean> {
    try {
      const result = await api.mobileReadingApi.apiAppMobileReadingUploadMobileLogFilePost(
        {
          deviceCode: DeviceInfo.getUniqueId(),
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
      l.error(e);
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
        await api.provider.set(token);
        await AsyncStorage.setItem('token', token);
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
          l.error(loginResult);
          throw new Error(SERVER_ERROR);
        }
      } else {
        l.error(loginResult);
        throw new Error(USERNAME_PWD_ERROR);
      }
    } catch (e) {
      l.error(e);
      throw new Error(USERNAME_PWD_ERROR);
    }
  }
}

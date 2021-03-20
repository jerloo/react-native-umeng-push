import AsyncStorage from '@react-native-community/async-storage';
import { SysSettingDto } from '../../apiclient/src/models';

export const FILE_UPLOAD_METHOD = 'FILE_UPLOAD_METHOD';
export const MobileReadingCanCharge = 'MobileReadingCanCharge';
export const MobileReadingChargeWay = 'MobileReadingChargeWay';
export const MobileReadingMustPhoto = 'MobileReadingMustPhoto';
export const IS_OPEN_DEPOSIT = 'IS_OPEN_DEPOSIT';
export const IS_SHOW_DEPOSIT_PAY = 'IS_SHOW_DEPOSIT_PAY';

export interface SystemSettings {
  fileUploadMethod: string;
  isMobileReadingCanCharge: boolean;
  mobileReadingChargeWay: string[];
  isMobileReadingMustPhoto: boolean;
  isOpenDeposit: boolean;
  isShowDepositPay: boolean;
}

export const getSystemSettings = async () => {
  const content = await AsyncStorage.getItem('systemSettings');
  return content ? (JSON.parse(content) as SystemSettings) : null;
};

const getSystemSettingByKey = (key: string, items: SysSettingDto[]) => {
  return items?.find((it) => it.code === key);
};

export const setSystemSettings = async (items: SysSettingDto[]) => {
  const settings: SystemSettings = {
    fileUploadMethod: getFileUploadMethod(items),
    isMobileReadingCanCharge: isMobileReadingCanCharge(items),
    mobileReadingChargeWay: getMobileReadingChargeWay(items) || [],
    isMobileReadingMustPhoto: isMobileReadingMustPhoto(items),
    isOpenDeposit: isOpenDeposit(items),
    isShowDepositPay: isShowDepositPay(items),
  };
  await AsyncStorage.setItem('systemSettings', JSON.stringify(settings));
};

const getFileUploadMethod = (items: SysSettingDto[]) => {
  return getSystemSettingByKey(FILE_UPLOAD_METHOD, items)?.value;
};

const isMobileReadingCanCharge = (items: SysSettingDto[]) => {
  return getSystemSettingByKey(MobileReadingCanCharge, items)?.value === '1';
};

const getMobileReadingChargeWay = (items: SysSettingDto[]) => {
  const result = getSystemSettingByKey(MobileReadingChargeWay, items)?.value;
  if (!result) {
    return null;
  }
  return (result as string).split(',');
};

const isMobileReadingMustPhoto = (items: SysSettingDto[]) => {
  return getSystemSettingByKey(MobileReadingMustPhoto, items)?.value === '1';
};

const isOpenDeposit = (items: SysSettingDto[]) => {
  return getSystemSettingByKey(IS_OPEN_DEPOSIT, items)?.value === '1';
};

const isShowDepositPay = (items: SysSettingDto[]) => {
  return getSystemSettingByKey(IS_SHOW_DEPOSIT_PAY, items)?.value === '1';
};

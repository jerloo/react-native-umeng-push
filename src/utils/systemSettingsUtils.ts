import AsyncStorage from '@react-native-community/async-storage';
import { SysSettingDto } from '../../apiclient/src/models';

export const FILE_UPLOAD_METHOD = 'FILE_UPLOAD_METHOD';
export const MobileReadingCanCharge = 'MobileReadingCanCharge';
export const MobileReadingChargeWay = 'MobileReadingChargeWay';
export const MobileReadingMustPhoto = 'MobileReadingMustPhoto';
export const IS_OPEN_DEPOSIT = 'IS_OPEN_DEPOSIT';
export const IS_SHOW_DEPOSIT_PAY = 'IS_SHOW_DEPOSIT_PAY';

export const getSystemSettings = async () => {
  const content = await AsyncStorage.getItem('systemSettings');
  return content ? (JSON.parse(content) as SysSettingDto[]) : null;
};

export const getSystemSettingByKey = async (key: string) => {
  const items = await getSystemSettings();
  return items?.find((it) => it.code === key);
};

export const setSystemSettings = async (items: SysSettingDto[]) => {
  await AsyncStorage.setItem('systemSettings', JSON.stringify(items));
};

export const getFileUploadMethod = async () => {
  (await getSystemSettingByKey(FILE_UPLOAD_METHOD))?.value;
};

export const isMobileReadingCanCharge = async () => {
  return (await getSystemSettingByKey(MobileReadingCanCharge))?.value === '1';
};

export const getMobileReadingChargeWay = async () => {
  const result = (await getSystemSettingByKey(MobileReadingCanCharge))?.value;
  if (!result) {
    return null;
  }
  console.log('getMobileReadingChargeWay');
  return (result as string).split(',');
};

export const isMobileReadingMustPhoto = async () => {
  return (await getSystemSettingByKey(MobileReadingMustPhoto))?.value === '1';
};

export const isOpenDeposit = async () => {
  return (await getSystemSettingByKey(IS_OPEN_DEPOSIT))?.value === '1';
};

export const isShowDepositPay = async () => {
  return (await getSystemSettingByKey(IS_SHOW_DEPOSIT_PAY))?.value === '1';
};

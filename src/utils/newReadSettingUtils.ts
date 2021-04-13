import AsyncStorage from '@react-native-community/async-storage';
import { getSession } from './sesstionUtils';

export interface NewReadSetting {
  alert: boolean;
  vibrate: boolean;
}

export const saveNewReadSetting = async (setting: NewReadSetting) => {
  const session = await getSession();
  const userName = session?.userInfo.userName;
  const tenantName = session?.tenantName;
  await AsyncStorage.setItem(
    `${tenantName}_${userName}_read_alert`,
    String(setting.alert),
  );
  await AsyncStorage.setItem(
    `${tenantName}_${userName}_read_vibrate`,
    String(setting.vibrate),
  );
};

export const getNewReadSetting = async () => {
  const session = await getSession();
  const userName = session?.userInfo.userName;
  const tenantName = session?.tenantName;
  const alert = await AsyncStorage.getItem(
    `${tenantName}_${userName}_read_alert`,
  );
  const vibrate = await AsyncStorage.getItem(
    `${tenantName}_${userName}_read_vibrate`,
  );
  const setting: NewReadSetting = {
    alert: alert ? JSON.parse(alert) : true,
    vibrate: vibrate ? JSON.parse(vibrate) : true,
  };
  return setting;
};

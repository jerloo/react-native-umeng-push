import AsyncStorage from '@react-native-community/async-storage';
import { PdaCustListDto } from '../../apiclient/src/models';
import { getSession } from './sesstionUtils';

export const saveSearchHistory = async (items: PdaCustListDto[]) => {
  if (items.length > 10) {
    items = items.slice(0, 10);
  }
  const content = JSON.stringify(items);
  const session = await getSession();
  const userName = session?.userInfo.userName;
  const tenantName = session?.tenantName;
  await AsyncStorage.setItem(
    `${tenantName}_${userName}_searchHistoryItems`,
    content,
  );
};

export const getSearchHistory = async () => {
  const session = await getSession();
  const userName = session?.userInfo.userName;
  const tenantName = session?.tenantName;
  const content = await AsyncStorage.getItem(
    `${tenantName}_${userName}_searchHistoryItems`,
  );
  return content ? (JSON.parse(content) as PdaCustListDto[]) : [];
};

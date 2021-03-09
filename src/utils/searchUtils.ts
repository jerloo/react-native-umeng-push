import AsyncStorage from '@react-native-community/async-storage';
import { PdaCustListDto } from '../../apiclient/src/models';

export const setSearchHistory = async (items: PdaCustListDto[]) => {
  const content = JSON.stringify(items);
  await AsyncStorage.setItem('searchHistoryItems', content);
};

export const getSearchHistory = async () => {
  const content = await AsyncStorage.getItem('searchHistoryItems');
  return content ? (JSON.parse(content) as PdaCustListDto[]) : [];
};

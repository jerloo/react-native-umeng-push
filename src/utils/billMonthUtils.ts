import AsyncStorage from '@react-native-community/async-storage';
import { ReadingMonthDto } from '../../apiclient/src/models';

export const getBillMonth = async () => {
  const result = await AsyncStorage.getItem('billMonth');
  if (!result) {
    return null;
  }
  try {
    return JSON.parse(result) as ReadingMonthDto;
  } catch (e) {
    return null;
  }
};

export const saveBillMonth = async (billMonth: ReadingMonthDto) => {
  await AsyncStorage.setItem('billMonth', JSON.stringify(billMonth));
};

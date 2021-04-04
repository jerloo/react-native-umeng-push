import AsyncStorage from '@react-native-community/async-storage';
import { ReadingMonthDto } from '../../apiclient/src/models';

export const getBillMonth = async (userId: string) => {
  const result = await AsyncStorage.getItem(`billMonth-${userId}`);
  if (!result) {
    return null;
  }
  try {
    return JSON.parse(result) as ReadingMonthDto;
  } catch (e) {
    return null;
  }
};

export const saveBillMonth = async (
  billMonth: ReadingMonthDto,
  userId: string,
) => {
  await AsyncStorage.setItem(`billMonth-${userId}`, JSON.stringify(billMonth));
};

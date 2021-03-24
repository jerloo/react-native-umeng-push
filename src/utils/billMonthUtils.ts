import AsyncStorage from '@react-native-community/async-storage';

export const getBillMonth = async () => {
  const result = await AsyncStorage.getItem('billMonth');
  if (!result) {
    return null;
  }
  return parseInt(result, 10);
};

export const saveBillMonth = async (billMonth: number) => {
  await AsyncStorage.setItem('billMonth', billMonth.toString());
};

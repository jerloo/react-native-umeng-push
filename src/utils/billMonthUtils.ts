import AsyncStorage from '@react-native-community/async-storage';

export const getBillMonth = async () => {
  return await AsyncStorage.getItem('billMonth');
};

export const setBillMonth = async (billMonth: string) => {
  await AsyncStorage.setItem('billMonth', billMonth);
};

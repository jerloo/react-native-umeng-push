import AsyncStorage from '@react-native-community/async-storage';

import { PdaReadStateDto } from '../../apiclient/src/models';

export const getReadStates = async () => {
  const value = await AsyncStorage.getItem('readStates');
  if (value) {
    return JSON.parse(value) as PdaReadStateDto[];
  }
  return [];
};

export const saveReadStates = async (states: PdaReadStateDto[]) => {
  await AsyncStorage.setItem('readStates', JSON.stringify(states));
};

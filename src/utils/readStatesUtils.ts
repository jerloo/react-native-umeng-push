import AsyncStorage from '@react-native-community/async-storage';

import { PdaReadStateDto } from '../../apiclient/src/models';

export const getReadStates = async () => {
  const value = await AsyncStorage.getItem('readStates');
  if (value) {
    return JSON.parse(value) as PdaReadStateDto[];
  }
  return [];
};

export const getAlgorithmByReadStateId = (
  readStateId: number,
  readStates: PdaReadStateDto[],
) => {
  const result = readStates.find((it) => it.id === readStateId);
  if (!result) {
    return readStates.find((it) => it.stateName === '正常')?.meterReadAlgorithm;
  }
  return result.meterReadAlgorithm;
};

export const saveReadStates = async (states: PdaReadStateDto[]) => {
  await AsyncStorage.setItem('readStates', JSON.stringify(states));
};

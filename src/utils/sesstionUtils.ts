import AsyncStorage from '@react-native-community/async-storage';
import { PdaMeterReaderDto } from '../../apiclient/src/models';

export interface UserSession {
  tenantName: string;
  password: string;
  autoLogin: boolean;
  userInfo: PdaMeterReaderDto;
  logout: boolean;
}

export const setSession = (session: UserSession) => {
  return AsyncStorage.setItem('session', JSON.stringify(session));
};

export const getSession = async () => {
  const objJson = await AsyncStorage.getItem('session');
  if (objJson === null) {
    return null;
  }
  const obj = JSON.parse(objJson);
  return obj as UserSession;
};

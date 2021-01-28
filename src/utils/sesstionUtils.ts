import AsyncStorage from '@react-native-community/async-storage';
import { MeterReaderDto } from '../../apiclient/src/models';

interface UserSession {
  autoLogin: boolean;
  userInfo: MeterReaderDto;
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

import { LoginInput, MeterReaderDto } from '../../apiclient/src/models';
import { api } from '../utils/apiUtils';
import { getSession, setSession } from '../utils/sesstionUtils';
import NetInfo from '@react-native-community/netinfo';

const NETWROK_ERROR = '服务器错误，请稍后再试';
const USERNAME_PWD_ERROR = '用户名或密码错误';

interface ApiService {
  login(payload: LoginInput, autoLogin: boolean): Promise<string | boolean>;
}

class OnlineApiService implements ApiService {
  async login(
    payload: LoginInput,
    autoLogin: boolean,
  ): Promise<string | boolean> {
    const loginResult = await api.loginApi.apiAppLoginLoginPost(payload);
    if (loginResult.status === 200) {
      await api.provider.set(
        loginResult.data.tokenType + ' ' + loginResult.data.accessToken,
      );
      const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
      if (infoResult.status === 200) {
        setSession({
          tenantName: payload.tenantName,
          password: payload?.passWord,
          autoLogin: autoLogin,
          userInfo: infoResult.data,
        });
        return true;
      } else {
        console.log(loginResult);
        return NETWROK_ERROR;
      }
    } else {
      console.log(loginResult);
      return USERNAME_PWD_ERROR;
    }
  }
  catch(e: Error) {
    console.log(e);
    return USERNAME_PWD_ERROR;
  }
}

class OfflineApiService implements ApiService {
  async login(
    payload: LoginInput,
    autoLogin: boolean,
  ): Promise<string | boolean> {
    const savedSession = await getSession();
    if (
      savedSession?.tenantName === payload.tenantName &&
      savedSession?.userInfo.userName === payload.userName &&
      savedSession?.password === payload.passWord
    ) {
      return true;
    }
    return USERNAME_PWD_ERROR;
  }
}

class CenterService implements ApiService {
  offline: OfflineApiService;
  online: OnlineApiService;

  constructor() {
    this.offline = new OfflineApiService();
    this.online = new OnlineApiService();
  }

  async login(
    payload: LoginInput,
    autoLogin: boolean,
  ): Promise<string | boolean> {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isInternetReachable === true) {
      return this.online.login(payload, autoLogin);
    }
    return this.offline.login(payload, autoLogin);
  }
}

export default new CenterService();

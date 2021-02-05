import { ChargeApi, LoginApi, MobileLogApi } from './src/api';
import Axios from 'axios';

const axiosInstance = Axios.create({
  timeout: 3000,
});
export interface AccessTokenProvider {
  get(): Promise<string>;
  set(token: string): Promise<void>;
}
export class ApiClient {
  loginApi: LoginApi;
  chargeApi: ChargeApi;
  logApi: MobileLogApi;

  provider: AccessTokenProvider;

  constructor(basePath: string, provider: AccessTokenProvider) {
    this.loginApi = new LoginApi({ basePath: basePath }, basePath, axiosInstance);
    this.chargeApi = new ChargeApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );
    this.logApi = new MobileLogApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );
    this.provider = provider;
  }
}

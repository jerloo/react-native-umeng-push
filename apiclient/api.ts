import {
  ChargeApi,
  LoginApi,
  MobilePaymentApi,
  MobileReadingApi,
  MobileSystemApi,
} from './src/api';
import Axios from 'axios';
import { AxiosLogger } from 'axios-pretty-logger';

const consola = require('consola');
const axiosLogger = AxiosLogger.using(consola.info, consola.error);

const axiosInstance = Axios.create({
  timeout: 3000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    config.metadata = { startTime: new Date() };
    process.env.NODE_ENV !== 'production' && axiosLogger.logRequest(config);
    return config;
  },
  function (error) {
    process.env.NODE_ENV !== 'production' && console.log(error);
    process.env.NODE_ENV !== 'production' && axiosLogger.logErrorDetails(error);
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  function (response) {
    response.config.metadata.endTime = new Date();
    response.duration =
      response.config.metadata.endTime - response.config.metadata.startTime;
    process.env.NODE_ENV !== 'production' && axiosLogger.logResponse(response);
    // process.env.NODE_ENV !== 'production' && console.log(response);
    process.env.NODE_ENV !== 'production' &&
      console.log(`API请求耗时：${response.duration / 1000}s`);
    return response;
  },
  function (error) {
    error.config.metadata.endTime = new Date();
    error.duration =
      error.config.metadata.endTime - error.config.metadata.startTime;
    process.env.NODE_ENV !== 'production' && axiosLogger.logErrorDetails(error);
    return Promise.reject(error);
  },
);

export interface AccessTokenProvider {
  get(): Promise<string>;
  set(token: string): Promise<void>;
}
export class ApiClient {
  loginApi: LoginApi;
  chargeApi: ChargeApi;
  mobileReadingApi: MobileReadingApi;
  mobileSystemApi: MobileSystemApi;
  paymentApi: MobilePaymentApi;

  provider: AccessTokenProvider;

  constructor(basePath: string, provider: AccessTokenProvider) {
    this.loginApi = new LoginApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );
    this.chargeApi = new ChargeApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );
    this.paymentApi = new MobilePaymentApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );
    this.mobileReadingApi = new MobileReadingApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );
    this.mobileSystemApi = new MobileSystemApi(
      {
        apiKey: provider.get,
      },
      basePath,
      axiosInstance,
    );

    this.provider = provider;
  }
}

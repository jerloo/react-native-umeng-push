import { ApiClient, AccessTokenProvider } from '../api';
import { TestUser_handa_malp } from './testuser';

let accessToken = null;

class TestProvider implements AccessTokenProvider {
  set(token: string): Promise<void> {
    accessToken = token;
    return Promise.resolve();
  }
  get(): Promise<string> {
    return accessToken;
  }
}

const api = new ApiClient(
  'http://mobilereadtransfer.yuncloudtech.cn',
  new TestProvider(),
);

const TestUser = TestUser_handa_malp;

test('Test 获取抄表员基础信息', async () => {
  const loginResult = await api.loginApi.apiAppLoginLoginPost(TestUser);
  expect(loginResult.status).toBe(200);
  accessToken = loginResult.data.tokenType + ' ' + loginResult.data.accessToken;

  const infoResult = await api.chargeApi.apiAppChargeUserInfoGet();
  expect(infoResult.status).toBe(200);
  expect(infoResult.data.email).toEqual('yysf@shyuntech.com');
});

test('Test 根据抄表员工号获取应抄册本', async () => {
  const loginResult = await api.loginApi.apiAppLoginLoginPost(TestUser);
  expect(loginResult.status).toBe(200);
  accessToken = loginResult.data.tokenType + ' ' + loginResult.data.accessToken;

  const infoResult = await api.chargeApi.apiAppChargeBookListGet();
  expect(infoResult.status).toBe(200);
  expect(infoResult.data.items).not.toBeNull();
  console.log('根据抄表员工号获取应抄册本', infoResult.data.items);
});

test('Test 根据设备编号下载抄表数据', async () => {
  const loginResult = await api.loginApi.apiAppLoginLoginPost(TestUser);
  expect(loginResult.status).toBe(200);
  accessToken = loginResult.data.tokenType + ' ' + loginResult.data.accessToken;

  const infoResult = await api.chargeApi.apiAppChargeReadDataByBookIdsPost({
    deviceCode: '',
    bookIds: [0],
  });
  expect(infoResult.status).toBe(200);
  expect(infoResult.data.items).not.toBeNull();
  console.log('根据设备编号下载抄表数据', infoResult.data.items);
});

test('Test 根据客户编号获取客户详细信息', async () => {
  const loginResult = await api.loginApi.apiAppLoginLoginPost(TestUser);
  expect(loginResult.status).toBe(200);
  accessToken = loginResult.data.tokenType + ' ' + loginResult.data.accessToken;

  const infoResult = await api.chargeApi.apiAppChargeCustDetailsByCustIdPost({
    custId: [0],
  });
  expect(infoResult.status).toBe(200);
  expect(infoResult.data.items).not.toBeNull();
  console.log('根据客户编号获取客户详细信息', infoResult.data.items);
});

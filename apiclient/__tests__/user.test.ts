import { ApiClient } from '../api';
import { TestUser_handa_malp, TestUser_shhd_306 } from './testuser';

const api = new ApiClient('http://mobilereadtransfer.yuncloudtech.cn');

test('Test 抄表员登录 1', async () => {
  const result = await api.loginApi.apiAppLoginLoginPost(TestUser_handa_malp);
  expect(result.status).toBe(200);
});

test('Test 抄表员登录 2', async () => {
  const result = await api.loginApi.apiAppLoginLoginPost(TestUser_shhd_306);
  expect(result.status).toBe(200);
});
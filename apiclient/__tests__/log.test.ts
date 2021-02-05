import axios from 'axios';
import { ApiClient, AccessTokenProvider } from '../api';
import { TestUser_handa_malp } from './user';
import COS from 'cos-nodejs-sdk-v5';
import fs from 'fs';
import path from 'path';

let accessToken = '';

class TestProvider implements AccessTokenProvider {
  set(token: string): Promise<void> {
    accessToken = token;
    return Promise.resolve();
  }
  get(): Promise<string> {
    return Promise.resolve(accessToken);
  }
}

const api = new ApiClient(
  'http://mobilereadtransfer.yuncloudtech.cn',
  new TestProvider(),
);

const TestUser = TestUser_handa_malp;

test('Test 上传日志文件', async () => {
  const loginResult = await api.loginApi.apiAppLoginLoginPost(TestUser);
  expect(loginResult.status).toBe(200);
  accessToken = loginResult.data.tokenType + ' ' + loginResult.data.accessToken;

  const cos = new COS({
    getAuthorization: async function (options, callback) {
      await axios
        .get(
          'http://81.68.221.56:44361/api/app/files/tempSecretKey?FileSource=2&Bucket=mobilereadapp&Prefix=handa',
        )
        .then((r) => {
          expect(r.status).toBe(200);
          const credentials = r.data;

          callback({
            TmpSecretId: credentials.TmpSecretId, // 临时密钥的 tmpSecretId
            TmpSecretKey: credentials.TmpSecretKey, // 临时密钥的 tmpSecretKey
            XCosSecurityToken: credentials.token, // 临时密钥的 sessionToken
            ExpiredTime: r.data.ExpiredTime, // 临时密钥失效时间戳，是申请临时密钥时，时间戳加 durationSeconds
            StartTime: r.data.StartTime,
          });
        });
    },
  });

  cos.putObject(
    {
      Bucket: 'mobilereadapp-1259078701' /* 必须 */,
      Region: 'ap-shanghai' /* 必须 */,
      Key: 'handa/log.test.1.txt' /* 必须 */,
      Body: fs.createReadStream(path.join(__dirname, '/data/log.test.1.txt')), // 上传文件对象
      onProgress: function (progressData) {
        expect(progressData).not.toBeNull();
        // console.log(JSON.stringify(progressData));
      },
    },
    function (err, ed) {
      console.log(err || ed);
      api.logApi
        .apiAppMobileLogUploadMobileLogFilePost({
          deviceCode: '1-1-1-1',
          logFiles: [
            {
              logFileName: 'handa/log.test.1.txt',
              logFileUrl: ed.Location,
            },
          ],
        })
        .then((v) => {
          expect(v.status).toBe(200);
        });
    },
  );
});

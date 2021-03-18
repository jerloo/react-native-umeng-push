var axios = require('axios');
var COS = require('cos-nodejs-sdk-v5');
var dayjs = require('dayjs');
var fs = require('fs');
var fileUtils = require('./fileUtil');
var path = require('path');

var COS_BUCKET_NAME = 'mobilereadapptest';
var prefix = 'handa';
var token =
  'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Im40UXNfTDduT2s4TTg3M0lzM1FOZ2ciLCJ0eXAiOiJhdCtqd3QifQ.eyJuYmYiOjE2MTYwNDE4ODAsImV4cCI6MTY0NzU3Nzg4MCwiaXNzIjoiaHR0cDovL2lkNC55dW5jbG91ZHRlY2guY24iLCJhdWQiOlsiQml6Q2hhcmdlU3lzdGVtIiwiRmlsZVNlcnZpY2UiLCJNb2JpbGVSZWFkU2VydmljZSJdLCJjbGllbnRfaWQiOiJNZXRlclJlYWRpbmdfQXBwIiwic3ViIjoiMzlmOTE1NDYtMTUyMS1kY2Q3LTdhNWYtNTg5YTM5OGYzNjE5IiwiYXV0aF90aW1lIjoxNjE2MDQxODgwLCJpZHAiOiJsb2NhbCIsInRlbmFudGlkIjoiMzlmOTE1M2UtYzVkMC02ODQzLTRhNTUtZTQxYTM5ZTg5MjIxIiwicm9sZSI6WyJhZG1pbiIsIuaKhOihqOWRmCIsIuaUtui0ueWRmCIsIuaUtui0uee7hOmVvyIsIuiQpeS4mue7j-eQhiIsIui0ouWKoSIsIuWCrOi0ueWRmCIsIuaAu-e7j-eQhiIsIuaNouihqOWRmCJdLCJuYW1lIjoieHVzaCIsImVtYWlsIjoieXlzZkBzaHl1bnRlY2guY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJwaG9uZV9udW1iZXIiOiIxODUxNjExMTExMSIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsInNjb3BlIjpbIkJpekNoYXJnZVN5c3RlbSIsIkZpbGVTZXJ2aWNlIiwiTW9iaWxlUmVhZFNlcnZpY2UiXSwiYW1yIjpbInB3ZCJdfQ.MRLEmtRbiz5WwIgNqlww4ZN7NhrgBGPmHR7wFABsBnNhin87CO3w_VIisZI9IRZnwf8wdIcX9GxsrBZ9cRsRZjHpURbGMvgnt0qYYpulSVcZ9pd6ob_Df_2DLfIPJgYv4xyJsjAQ_04b84HlOV8ODiPQCZIbmJXOIbX3nzlSwse1DhVMbyHk6MwiA1y0V0uFJ3dTL6iWNS3xwtxdPvL7mT38NtYPYUwR-qDx_kl1h1lnqxvKhwO5PP8ITbTky3ohdVrw1skb6EHojBcQxfmM4MztgwDpZSnlowd2Lgyy3Ks27bt9KjU88M3L7gwr-14FugiNnRNpiXZECtSnRmTfEw';

const cos = new COS({
  getAuthorization: function (options, callback) {
    console.log(
      '开始请求获取临时凭证接口',
      dayjs().format('YYYY-MM-DD HH:mm:ss'),
    );
    // 请求临时密钥
    axios
      .get(
        `http://fileservice.yuncloudtech.cn/api/app/files/tempSecretKey?FileSource=2&Bucket=${COS_BUCKET_NAME}&Prefix=${prefix}`,
        {
          headers: {
            Authorization: token,
          },
          timeout: 3000,
        },
      )
      .then((response) => {
        console.log(
          '完成请求获取临时凭证接口',
          dayjs().format('YYYY-MM-DD HH:mm:ss'),
        );
        console.log(response.data);
        const credentials = response.data.Credentials;
        const expiredTime = response.data.ExpiredTime;
        callback({
          TmpSecretId: credentials.TmpSecretId,
          TmpSecretKey: credentials.TmpSecretKey,
          ExpiredTime: expiredTime,
          XCosSecurityToken: credentials.Token,
          StartTime: response.data.StartTime,
        });
      });
  },
});

var filename = '5mb.zip';
var filepath = path.resolve(__dirname, filename);

fileUtils.createFile(filepath, 1024 * 1024 * 5, function (e) {
  console.log(e);
  cos.putObject(
    {
      Bucket: `${COS_BUCKET_NAME}-1259078701` /* 必须 */,
      Region: 'ap-shanghai',
      Key: `${prefix}/${filename}` /* 必须 */,
      onProgress: function (progressData) {
        console.log(JSON.stringify(progressData));
      },
      // 格式1. 传入文件内容
      // Body: fs.readFileSync(filepath),
      // 格式2. 传入文件流，必须需要传文件大小
      Body: fs.createReadStream(filepath),
      ContentLength: fs.statSync(filepath).size,
      // 万象持久化接口，上传时持久化
      // 'Pic-Operations': '{"is_pic_info": 1, "rules": [{"fileid": "test.jpg", "rule": "imageMogr2/thumbnail/!50p"}]}'
    },
    function (err, data) {
      console.log(err || data);
      fs.unlinkSync(filepath);
      axios
        .post(
          'http://mobilereadtransfer.yuncloudtech.cn/api/app/mobileReading/uploadMobileLogFile',
          {
            deviceCode: '1-1-1-1',
            logFiles: [
              {
                logFileName: filename,
                logFileUrl: data.Location,
              },
            ],
          },
          {
            headers: {
              Authorization: token,
            },
            timeout: 3000,
          },
        )
        .then((r) => {
          console.log('全部完成', dayjs().format('YYYY-MM-DD HH:mm:ss'));
        });
    },
  );
});

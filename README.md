# 抄表APP

## Development

### 开发环境

- nodejs 14 lts

### 开发步骤

1. 安装依赖包

```console
yarn install
```

2. 连接安卓手机或打开安卓模拟器后

```console
npx react-native run-android
```

2. 连接iOS手机或打开iOS模拟器后

```console
npx react-native run-ios
```

### API地址

### 测试环境

http://mobilereadtransfer.yuncloudtech.cn/index.html

## 测试账号

| 机构编码 | 用户名 | 密码           |
| -------- | ------ | -------------- |
| handa    | malp   | Mobile_2021!.  |
| shhd     | 306    | Mobile_2021!.T |

## 问题 20210204

1、~~登录页，点击登录后，租户、账号、密码都不能再次点击~~；
2、~~租户、账号、密码都输入以后才能点击登录；目前不输入账号时，未提示：请输入登录账号~~；
3、~~个人信息修改时，姓名、手机号、密码修改完成后，需提示修改成功后返回个人信息；~~
4、~~密码修改部分，输入后均应该*号显示~~

## 问题 20210205

1. ~~登录人姓名修改后，个人信息里姓名显示和首页姓名显示没实时更新；~~
2. ~~手机号码未加正则验证；位数大于11位也可以；前端也需增加限制；必须符合手机号码规则，不符合不能点击保存；另如原用户无手机号，但是修改手机号以后用户信息里也未实时更新手机号显示（有手机号修改后也未同步更新）；~~
3. 日志上传无效，一直转圈；
4. ~~密码修改成功，完成应返回登录页面；输入旧密码；输入新密码，输入新密码，点击确认时先校验新旧密码是否一致，再调用接口；~~
5. 退出登录功能无效；退出登录调用接口；
6. 日志上传过程中，点击返回按钮，回到首页，上传中还一直转圈，需关闭app才可以；
7. 登录页，缺口问题；
8. 登录人姓名和缓存清理成功后，点日志上传提示上传失败，需要重新打开软件上传。

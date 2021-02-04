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
# 抄表APP

## 开发

### 开发环境

- nodejs 14 lts
- android 基本开发环境
- ios 基本开发环境

具体开发环境搭建见 react native 官方文档

### 开发步骤

1. 克隆本项目到本地
2. 安装依赖包

```console
yarn install
npx pod-install (在开发和打包ios版本时使用)
```

3. 运行开发程序

安卓开发: 调试在连接Android手机或者模拟器后运行:
```console
npx react-native run-android
```
iOS开发: 连接iOS手机或打开iOS模拟器后

```console
npx react-native run-ios
```

### 打包步骤

#### Android 打包步骤

运行打包命令

```console
npx react-native run-android --variant=release
```
然后忽略报错信息, 文件 `android/app/build/outputs/apk/release/app-release.apk` 就是Android打包后的可分发app文件

### iOS 打包步骤

本人iOS开发者证书过期,不太好截图,相关打包过程请按照下方链接内容进行

https://blog.csdn.net/weixin_43586120/article/details/104622566

1. 在ios目录下新建bundle目录。
2. 进行编译，离线打包资源
```console
react-native bundle  --entry-file index.js --platform ios --dev false --bundle-output ./ios/bundle/index.ios.jsbundle --assets-dest ./ios/bundle
```
可以将相关命令加入`package.json`中
```json
"scripts": {
    ...,
    "bundle-ios":"node node_modules/react-native/local-cli/cli.js bundle --entry-file index.js  --platform ios --dev false --bundle-output ./ios/bundle/index.ios.jsbundle --assets-dest ./ios/bundle"
}
```
3. 打开 xcode 项目文件, 右键项目菜单, `Add Files to "项目名"`
4. 选择之前打包的bundle文件，在option中选择`Create folder references`,(注意: 添加到项目中的文件夹必须是蓝色)
5. 设置AppDelegate.m文件
修改ios目录下与项目同名的文件目录里边的`AppDelegate.m: jsCodeLocation`
```oc
NSURL *jsCodeLocation;
//测试
#if DEBUG
jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
 
//正式
#else
jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
 
#endif
```
6. Xcode——Product——Schema——Edit Scheme，查看run选择的模式，将项目由debug状态改成release状态（debug为内测，release为发布App Store）
7. 点击Product——Archive开始打包。显示build完成之后，显示弹框：点击Distribute App

### API地址

### 测试环境

http://mobilereadtransfer.yuncloudtech.cn/index.html

## 测试账号

| 机构编码 | 用户名 | 密码           |
| -------- | ------ | -------------- |
| handa    | malp   | Mobile_2021!.  |
| shhd     | 306    | Mobile_2021!.T |
| handa    | xush   | 1q2w3E*        |

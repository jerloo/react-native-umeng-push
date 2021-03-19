import { Linking } from 'react-native';

export const MAP_NAME_QQ = '腾讯地图';
export const MAP_NAME_AMAP = '高德地图';
export const MAP_NAME_BAIDU = '百度地图';

export const queryInstalledMaps = async () => {
  const queryQQMap = 'qqmap://map/search';
  const queryAmap = 'amapuri://poi';
  const queryBaiduAmp = 'baidumap://map/geocoder';
  const ms: string[] = [];
  if (await Linking.canOpenURL(queryQQMap)) {
    ms.push(MAP_NAME_QQ);
  }
  if (await Linking.canOpenURL(queryAmap)) {
    ms.push(MAP_NAME_AMAP);
  }
  if (await Linking.canOpenURL(queryBaiduAmp)) {
    ms.push(MAP_NAME_BAIDU);
  }
  return ms;
};

export const openQQMap = async (address: string) => {
  const queryQQMap = `qqmap://map/search?keyword=${address}&center=CurrentLocation&radius=1000&referer=SBMBZ-CUB6J-4UUF2-FJXZ7-W3UQZ-SNB2D`;
  if (await Linking.canOpenURL(queryQQMap)) {
    await Linking.openURL(queryQQMap);
  } else {
    throw new Error('未安装支持的地图应用');
  }
};

export const openAmap = async (address: string) => {
  const queryAmap = `amapuri://poi?sourceApplication=com.yytech.mobilereadapp&keywords==${address}`;
  if (await Linking.canOpenURL(queryAmap)) {
    await Linking.openURL(queryAmap);
  } else {
    throw new Error('未安装支持的地图应用');
  }
};

export const openBaiduMap = async (address: string) => {
  const queryBaiduAmp = `baidumap://map/geocoder?address=${address}&src=com.yytech.mobilereadapp`;
  if (await Linking.canOpenURL(queryBaiduAmp)) {
    await Linking.openURL(queryBaiduAmp);
  } else {
    throw new Error('未安装支持的地图应用');
  }
};

export const openMap = async (mapName: string, address: string) => {
  switch (mapName) {
    case MAP_NAME_AMAP:
      return openAmap(address);
    case MAP_NAME_QQ:
      return openQQMap(address);
    case MAP_NAME_BAIDU:
      return openBaiduMap(address);
    default:
      throw new Error('未安装支持的地图应用');
  }
};

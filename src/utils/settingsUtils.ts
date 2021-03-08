import AsyncStorage from '@react-native-community/async-storage';
import { PdaReadStateDto } from '../../apiclient/src/models';

const json = `{
  "items": [
    {
      "stateCode": "1001",
      "stateName": "抄见",
      "meterReadAlgorithm": 0,
      "sort": 0,
      "parentId": 0,
      "remark": null,
      "id": 1
    },
    {
      "stateCode": "1003",
      "stateName": "估表",
      "meterReadAlgorithm": 0,
      "sort": 0,
      "parentId": 0,
      "remark": null,
      "id": 2
    },
    {
      "stateCode": "QT",
      "stateName": "其它",
      "meterReadAlgorithm": 3,
      "sort": 0,
      "parentId": 1,
      "remark": null,
      "id": 3
    },
    {
      "stateCode": "ZC",
      "stateName": "正常",
      "meterReadAlgorithm": 1,
      "sort": 0,
      "parentId": 1,
      "remark": null,
      "id": 4
    },
    {
      "stateCode": "1005",
      "stateName": "自报",
      "meterReadAlgorithm": 0,
      "sort": 0,
      "parentId": 0,
      "remark": null,
      "id": 5
    },
    {
      "stateCode": "ZG",
      "stateName": "暂估",
      "meterReadAlgorithm": 6,
      "sort": 0,
      "parentId": 2,
      "remark": null,
      "id": 6
    },
    {
      "stateCode": "BH",
      "stateName": "表坏",
      "meterReadAlgorithm": 6,
      "sort": 0,
      "parentId": 2,
      "remark": null,
      "id": 7
    },
    {
      "stateCode": "SM",
      "stateName": "水没",
      "meterReadAlgorithm": 6,
      "sort": 0,
      "parentId": 2,
      "remark": null,
      "id": 8
    },
    {
      "stateCode": "MB",
      "stateName": "门闭",
      "meterReadAlgorithm": 6,
      "sort": 0,
      "parentId": 2,
      "remark": null,
      "id": 9
    },
    {
      "stateCode": "DM",
      "stateName": "堆没",
      "meterReadAlgorithm": 6,
      "sort": 0,
      "parentId": 2,
      "remark": null,
      "id": 10
    },
    {
      "stateCode": "MBZB",
      "stateName": "门闭自报",
      "meterReadAlgorithm": 1,
      "sort": 0,
      "parentId": 5,
      "remark": null,
      "id": 11
    },
    {
      "stateCode": "ZCZB",
      "stateName": "正常自报",
      "meterReadAlgorithm": 1,
      "sort": 0,
      "parentId": 5,
      "remark": null,
      "id": 12
    }
  ]
}`;

interface ReadStateStorage {
  offen: PdaReadStateDto[];
  normal: PdaReadStateDto[];
}

export const getReadStateSettings = async () => {
  const content = await AsyncStorage.getItem('readStates');
  return content ? (JSON.parse(content) as PdaReadStateDto[]) : [];
};

export const setReadStateSettings = async (items: PdaReadStateDto[]) => {
  const content = JSON.stringify(items);
  await AsyncStorage.setItem('readStates', content);
};

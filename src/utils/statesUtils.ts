import AsyncStorage from '@react-native-community/async-storage';
import { PdaReadStateDto } from '../../apiclient/src/models';

`{
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

interface ReadStateGroupItem extends PdaReadStateDto {
  children: PdaReadStateDto[];
}

export interface ReadStateStorage {
  offens: PdaReadStateDto[];
  groups: ReadStateGroupItem[];
  items: PdaReadStateDto[];
}

const defaultOffenNames = ['正常', '其他', '失灵', '暂估', '门闭', '表坏'];

export const getReadStateSettings = async () => {
  const content = await AsyncStorage.getItem('readStates');
  const state = content ? (JSON.parse(content) as ReadStateStorage) : null;
  return state;
};

export const setReadStateSettings = async (items: PdaReadStateDto[]) => {
  let state = await getReadStateSettings();
  if (!state) {
    const offenReadStatesIds = items
      .filter((it) => defaultOffenNames.indexOf(it.stateName) > -1)
      .map((it) => it.id);
    const normals = items.filter(
      (it) => defaultOffenNames.indexOf(it.stateName) < 0,
    );
    const groups = (normals.filter(
      (it) => it.parentId === 0,
    ) as ReadStateGroupItem[]).map((it) => {
      it.children = normals.filter((i) => i.parentId === it.id);
      return it;
    });
    state = {
      offens: items.filter((it) => offenReadStatesIds.indexOf(it.id) > -1),
      groups: groups,
      items: items,
    };
  } else {
    if (state.offens.length === 0) {
      const offenReadStatesIds = items
        .filter((it) => defaultOffenNames.indexOf(it.stateName) > -1)
        .map((it) => it.id);
      const normals = items.filter(
        (it) => defaultOffenNames.indexOf(it.stateName) < 0,
      );
      const groups = (normals.filter(
        (it) => it.parentId === 0,
      ) as ReadStateGroupItem[]).map((it) => {
        it.children = normals.filter((i) => i.parentId === it.id);
        return it;
      });
      state = {
        offens: items.filter((it) => offenReadStatesIds.indexOf(it.id) > -1),
        groups: groups,
        items: items,
      };
    }
    state.offens = state.offens.filter((it) => items.find((i) => i.id === it));
    const normals = items.filter((it) =>
      state?.offens.find((i) => i.id === it.id),
    );
    const groups = (normals.filter(
      (it) => it.parentId === 0,
    ) as ReadStateGroupItem[]).map((it) => {
      it.children = normals.filter((i) => i.parentId === it.id);
      return it;
    });
    state.groups = groups;
    state.items = items;
  }

  const content = JSON.stringify(state);
  await AsyncStorage.setItem('readStates', content);
};

export const getAlgorithmByReadStateId = (
  readStateId: number,
  readStates: PdaReadStateDto[],
) => {
  const result = readStates.find((it) => it.id === readStateId);
  if (!result) {
    return readStates.find((it) => it.stateName === '正常')?.meterReadAlgorithm;
  }
  return result.meterReadAlgorithm;
};

import { PdaReadDataDto, PdaReadStateDto } from '../../apiclient/src/models';
import { getAlgorithmByReadStateId } from './readStatesUtils';

export const normalCalc = (data: PdaReadDataDto) => {
  const result = data.reading - data.lastReading + data.replaceWater;
  console.log('正常算法: 水量=本次抄码 - 上次抄码 + 换表水量');
  console.log(
    `正常算法: ${result} = ${data.reading} - ${data.lastReading} + ${data.replaceWater}`,
  );
  return result;
};

export const overCircleCalc = (data: PdaReadDataDto) => {
  const result =
    data.rangeValue - data.lastReading + data.reading + data.replaceWater;
  console.log('过圈算法:  (量程 – 上次抄码) + 本次抄码 + 换表数量');
  console.log(
    `过圈算法: ${result} = (${data.rangeValue} - ${data.lastReading}) + ${data.reading} + ${data.replaceWater}`,
  );
  return result;
};

export const reverseCalc = (data: PdaReadDataDto) => {
  const result = data.lastReading - data.reading + data.replaceWater;
  console.log('倒装算法: 上次抄码-本期抄码+换表数量');
  console.log(
    `倒装算法: ${result} = ${data.lastReading} - ${data.reading} + ${data.replaceWater}`,
  );
  return result;
};

export const noWatterCalc = (_data: PdaReadDataDto) => {
  return 0;
};

export const roundCalc = (data: PdaReadDataDto) => {
  const result = data.reading - data.lastReading + data.replaceWater;
  console.log('估表算法: 水量=本次抄码 - 上次抄码 + 换表水量');
  console.log(
    `估表算法: ${result} = ${data.reading} - ${data.lastReading} + ${data.replaceWater}`,
  );
  return result;
};

const CALCS: {
  [key: number]: (data: PdaReadDataDto) => number;
} = {
  1: normalCalc,
  2: overCircleCalc,
  4: reverseCalc,
  5: noWatterCalc,
  6: roundCalc,
};

export const calcReadWater = (
  data: PdaReadDataDto,
  readStates: PdaReadStateDto[],
) => {
  try {
    const algorithm = getAlgorithmByReadStateId(data.readStateId, readStates);
    console.log('抄表算法数值', algorithm);
    if (algorithm && [1, 2, 4, 5, 6].indexOf(algorithm) > -1) {
      const fn = CALCS[algorithm];
      return fn(data);
    } else {
      return normalCalc(data);
    }
  } catch (e) {
    console.log('calcReadWater', e);
    return normalCalc(data);
  }
};

export const WATER_HIGHER = '水量偏高，是否重新抄表？';
export const WATER_LOWER = '水量偏低，是否重新抄表？';
export const judgeReadWater = (
  value: number,
  data: PdaReadDataDto,
  readStates: PdaReadStateDto[],
) => {
  if (data.rangeValue <= data.reading) {
    return '本次抄码不得大于量程';
  }
  const algorithm = getAlgorithmByReadStateId(data.readStateId, readStates);
  switch (algorithm) {
    case 1:
      if (data.reading < data.lastReading) {
        return '本次抄码不得小于上次抄码';
      }
      break;
    case 2:
      break;
    case 4:
      if (data.reading > data.lastReading) {
        return '本次抄码不得大于上次抄码';
      }
      break;
    case 6:
      if (data.reading < data.lastReading) {
        return '本次抄码不得小于上次抄码';
      }
      break;
  }
  if (value > data.highWater) {
    return WATER_HIGHER;
  }
  if (value < data.lowWater) {
    return WATER_LOWER;
  }
  return null;
};

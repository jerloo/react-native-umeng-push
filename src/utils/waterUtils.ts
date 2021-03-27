import { PdaReadDataDto, PdaReadStateDto } from '../../apiclient/src/models';
import { l } from './logUtils';
import { getAlgorithmByReadStateId } from './statesUtils';

export const normalCalc = (data: PdaReadDataDto): number => {
  if (!data.reading) {
    throw new Error('本次抄码不能为空');
  }
  const result = data.reading - data.lastReading + data.replaceWater;
  l.info('正常算法: 水量=本次抄码 - 上次抄码 + 换表水量');
  l.info(
    `正常算法: ${result} = ${data.reading} - ${data.lastReading} + ${data.replaceWater}`,
  );
  return result;
};

export const overCircleCalc = (data: PdaReadDataDto) => {
  if (!data.reading) {
    throw new Error('本次抄码不能为空');
  }
  const result =
    data.rangeValue - data.lastReading + data.reading + data.replaceWater;
  l.info('过圈算法:  (量程 – 上次抄码) + 本次抄码 + 换表数量');
  l.info(
    `过圈算法: ${result} = (${data.rangeValue} - ${data.lastReading}) + ${data.reading} + ${data.replaceWater}`,
  );
  return result;
};

export const reverseCalc = (data: PdaReadDataDto) => {
  if (!data.reading) {
    throw new Error('本次抄码不能为空');
  }
  const result = data.lastReading - data.reading + data.replaceWater;
  l.info('倒装算法: 上次抄码-本期抄码+换表数量');
  l.info(
    `倒装算法: ${result} = ${data.lastReading} - ${data.reading} + ${data.replaceWater}`,
  );
  return result;
};

export const noWatterCalc = (_data: PdaReadDataDto) => {
  l.info('无量算法: 水量 = 0');
  return 0;
};

export const roundCalc = (data: PdaReadDataDto) => {
  if (!data.reading) {
    throw new Error('本次抄码不能为空');
  }
  const result = data.reading - data.lastReading + data.replaceWater;
  l.info('估表算法: 水量=本次抄码 - 上次抄码 + 换表水量');
  l.info(
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
    l.info('抄表算法数值', algorithm);
    if (algorithm && [1, 2, 4, 5, 6].indexOf(algorithm) > -1) {
      const fn = CALCS[algorithm];
      return parseInt(fn(data).toFixed(0), 10);
    } else {
      return parseInt(normalCalc(data).toFixed(0), 10);
    }
  } catch (e) {
    l.error('calcReadWater', e);
    return parseInt(normalCalc(data).toFixed(0), 10);
  }
};

export const WATER_HIGHER = '水量偏高，是否重新抄表？';
export const WATER_LOWER = '水量偏低，是否重新抄表？';
export const judgeReadWater = (
  value: number,
  data: PdaReadDataDto,
  readStates: PdaReadStateDto[],
) => {
  if (!data.reading) {
    throw new Error('本次抄码不能为空');
  }
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

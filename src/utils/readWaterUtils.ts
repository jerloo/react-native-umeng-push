import { PdaReadDataDto } from '../../apiclient/src/models';

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

export const calcReadWater = (data: PdaReadDataDto) => {
  try {
    if (data.readStateId && [1, 2, 4, 5, 6].indexOf(data.readStateId) > -1) {
      const fn = CALCS[data.readStateId];
      return fn(data);
    } else {
      return normalCalc(data);
    }
  } catch (e) {
    return normalCalc(data);
  }
};

export const judgeReadWater = (value: number, data: PdaReadDataDto) => {
  if (value > data.highWater) {
    return '水量偏高，是否重新抄表？';
  }
  if (value < data.lowWater) {
    return '水量偏低，是否重新抄表？';
  }
  return null;
};

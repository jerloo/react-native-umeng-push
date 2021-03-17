export const recordState = (n: number | undefined) => {
  if (n === 0) {
    return '未抄';
  } else if (n === 1) {
    return '已抄';
  } else if (n === 2) {
    return '已复核';
  } else if (n === 3) {
    return '已开账';
  }
  return '';
};

export const meterState = (n: string) => {
  if (n === '0') {
    return '正常';
  } else if (n === '1') {
    return '新装';
  } else if (n === '2') {
    return '换表';
  } else if (n === '3') {
    return '拆下';
  }
  return '';
};

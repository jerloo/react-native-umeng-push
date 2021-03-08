export const sum = (array: number[]) => {
  let s = 0;
  for (let i = 0; i < array.length; i++) {
    s += array[i];
  }
  return s;
};

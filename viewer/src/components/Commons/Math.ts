export function avg(array: []) {
  const len = array.length;
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum += array[i] * 1;
  }
  return sum / len;
}

export function stddev(array: [], avg: number){
  let sum = 0;
  for (let i = 0; i < array.length; i++) {
    const dev = array[i] - avg;
    sum += dev * dev;
  }
  return Math.sqrt(sum) / array.length;
}

export function range(array: []){
  let min = 9999999999;
  let max = -1;
  for (let i = 0; i < array.length; i++) {
      if (array[i] < min){
        min = array[i];
      }
      if (array[i] > max){
        max = array[i];
      }
  }
  return {min, max};
}

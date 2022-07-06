export const sumObjectKeyValues = <T>(data: T, key: keyof T): number => {
  return Object.keys(data)
    .map((k1) => data[k1][key])
    .reduce((curr, acc) => curr + (acc || 0));
};

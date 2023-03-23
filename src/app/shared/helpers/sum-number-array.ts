export const sumFlatArray = (
  arr: number[],
): number => arr.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

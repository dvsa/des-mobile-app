export const isAnyOf = <T>(
  dataValue: T,
  valuesToCheck: Array<T>,
): boolean => valuesToCheck.some((value: T) => dataValue === value);

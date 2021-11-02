/*
    Lookup a key in an enum using the raw value
    e.g.
    console.log(getEnumKeyByValue(ActivityCodes, '1'));
    // ['PASS', '1']
 */
export const getEnumKeyByValue = <T, V>(enumType: T, value: V): [string, V] => {
  return Object
    .entries(enumType)
    .map((entries) => entries)
    .find((entry) => entry.includes(value));
};

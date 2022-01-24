export function flattenArray(array: string[]): string {
  let result = '';

  array.forEach((value, index) => {
    if (index === 0) {
      result = result.concat(value);
      return;
    }

    if (index === array.length - 1) {
      result = result.concat(` and ${value}`);
      return;
    }
    result = result.concat(`, ${value}`);
  });

  return result;
}

export function convertBooleanToString(value: boolean): string {
  return value ? 'Yes' : 'No';
}

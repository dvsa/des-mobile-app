export function flattenArray(array: string[]): string {
  return (
    array
      // join together with a comma
      .join(', ')
      // replace the last comma with 'and'
      .replace(/, ([^,]*)$/, ' and $1')
  );
}

export function convertBooleanToString(value: boolean): string {
  return value ? 'Yes' : 'No';
}

import { Pipe, PipeTransform } from '@angular/core';
import FuzzySearch from 'fuzzy-search';

@Pipe({
  name: 'doesContain',
})
export class ContainsPipe implements PipeTransform {
  private static readonly opts: { caseSensitive: boolean; sort: boolean; } = {
    caseSensitive: false,
    sort: true, // sorts in order of best match;
  };

  transform<T>(dataList: T[], keys: (keyof T)[], value: string): T[] {
    if (!value) {
      return dataList;
    }
    return new FuzzySearch(dataList, keys, ContainsPipe.opts).search(value);
  }
}

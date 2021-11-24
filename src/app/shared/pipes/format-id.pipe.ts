import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatToID',
})
export class FormatIdPipe implements PipeTransform {

  transform(value: string, prefix?: string, isValue?: boolean): string {
    if (typeof value !== 'string') return;

    const id: string = value.replace(/ /g, '-').toLowerCase();
    const label = isValue ? 'value' : 'label';

    if (prefix) {
      return `${prefix}-${id}-${label}`;
    }
    return `${id}-${label}`;
  }

}

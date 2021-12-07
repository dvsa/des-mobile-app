import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ellipsis',
})
export class EllipsisPipe implements PipeTransform {

  transform(value: string, truncateAt: number = 25): string {
    if (typeof value !== 'string') return;

    if (value.length <= truncateAt) return value;

    return `${value.slice(0, truncateAt)}...`;
  }

}

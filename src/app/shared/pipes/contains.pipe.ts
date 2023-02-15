import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'doesContain',
})
export class ContainsPipe implements PipeTransform {

  transform<T>(dataList: T[], key: string, value: string): T[] {
    if (!value) {
      return dataList;
    }

    return dataList.filter(
      (data: T) => (data[key] as string).toLowerCase().includes(value.toLowerCase()),
    );
  }
}

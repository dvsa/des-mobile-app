import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customKeyValue',
})
export class CustomKeyValuePipe implements PipeTransform {

  transform<T>(object: T, key: string): { [key: string]: keyof T } [] {
    return Object.keys(object).map((k) => ({
      [key]: object[k],
    }));
  }
}

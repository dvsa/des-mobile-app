import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customKeyValue',
  standalone: false,
})
export class CustomKeyValuePipe implements PipeTransform {
  transform<T>(object: T, key: string): { [key: string]: keyof T }[] {
    return Object.keys(object).map((k) => ({
      [key]: object[k],
    }));
  }
}

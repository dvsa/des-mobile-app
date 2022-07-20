import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customKeyValue',
})
export class CustomKeyValuePipe implements PipeTransform {

  /**
   * Pipe to convert competency label dynamically
   * @param object
   * @param key
   */
  transform<T>(object: T, key: string): { [key: string]: keyof T } [] {
    return Object.keys(object).map((k) => ({
      [key]: object[k],
    }));
  }
}

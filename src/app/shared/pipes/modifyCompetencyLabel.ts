import { Pipe, PipeTransform } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Pipe({
  name: 'modifyCompetencyLabel',
})
export class ModifyCompetencyLabel implements PipeTransform {

  /**
   * Pipe to convert competency label dynamically
   * @param value
   * @param testCategory
   * @param fault
   */
  transform(value: string, testCategory: TestCategory, fault: string): string {
    // For CatA tests change move off to move away
    if (testCategory && (testCategory.includes('EUA') && fault.toUpperCase().replace(/\s/g, '').includes('MOVEOFF'))) {
      return value.replace('off', 'away');
    }
    return value;
  }
}

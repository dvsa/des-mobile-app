import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

@Component({
  selector: 'test-category',
  templateUrl: 'test-category.html',
  styleUrls: ['test-category.scss'],
})
export class TestCategoryComponent {

  @Input()
  testCategory: TestCategory | CategoryCode;

}

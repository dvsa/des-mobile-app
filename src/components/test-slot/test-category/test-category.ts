import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Component({
  selector: 'test-category',
  templateUrl: 'test-category.html',
  styleUrls: ['test-category.scss'],
})
export class TestCategoryComponent {
  @Input()
  category: TestCategory | string;

  @Input()
  applicationId: number;
}

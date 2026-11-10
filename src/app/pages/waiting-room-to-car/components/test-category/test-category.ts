import { Component, Input } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonCol, IonRow } from '@ionic/angular';

@Component({
  selector: 'test-category',
  templateUrl: 'test-category.html',
  styleUrls: ['test-category.scss'],
  imports: [IonRow, IonCol],
})
export class TestCategoryComponent {
  @Input()
  testCategory: TestCategory | CategoryCode;
}

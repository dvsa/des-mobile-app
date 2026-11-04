import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { IonText } from '@ionic/angular';

@Component({
  selector: 'test-category',
  templateUrl: 'test-category.html',
  styleUrls: ['test-category.scss'],
  imports: [IonText],
})
export class TestCategoryComponent {
  @Input()
  category: TestCategory | string;

  @Input()
  applicationId: string;
}

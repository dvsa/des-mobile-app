import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import * as CatADI3Types from '@dvsa/mes-test-schema/categories/ADI3';

@Component({
  selector: 'trainer-details-card',
  templateUrl: 'trainer-details-card.html',
  styleUrls: ['trainer-details-card.scss'],
})
export class TrainerDetailsCardComponent {

  @Input()
  trainerData: CatADI3Types.TrainerDetails;

  @Input()
  reviewData: CatADI3Types.Review;

  @Input()
  category: TestCategory | CategoryCode;

  @Input()
  driverPRNNumber: number;

  public isADI3 = (): boolean => this.category === TestCategory.ADI3;
}

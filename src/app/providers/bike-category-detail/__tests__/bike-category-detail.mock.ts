import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { BikeCategoryDetail, BikeTestType } from '@providers/bike-category-detail/bike-category-detail.model';

@Injectable()
export class BikeCategoryDetailProviderMock {
  public getDetailByCategoryCode(category: CategoryCode): BikeCategoryDetail {
    return {
      testType: BikeTestType.MOD1,
      categoryCode: category,
      displayId: 'testID',
      displayName: 'testName',
      imageUrl: 'testUrl',
    };
  }

  public getAllDetailsByTestType(testType: BikeTestType): BikeCategoryDetail[] {
    return [
      {
        testType: testType,
        categoryCode: TestCategory.EUAM1,
        displayId: 'testID',
        displayName: 'testName',
        imageUrl: 'testUrl',
      },
    ];
  }
}

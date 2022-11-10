import {
  ManoeuvreUnion,
  TestDataUnion,
} from '@shared/unions/test-schema-unions';

import {
  getManoeuvres as getManoeuvresC,
} from '@store/tests/test-data/cat-c/test-data.cat-c.selector';
import {
  getManoeuvres as getManoeuvresD,
} from '@store/tests/test-data/cat-d/test-data.cat-d.selector';
import {
  getManoeuvres as getManoeuvresHomeTest,
} from '@store/tests/test-data/cat-home/test-data.cat-home.selector';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';

@Injectable()
export class ManoeuvresByCategoryProvider {

  static getManoeuvresByCategoryCodeErrMsg: string = 'Error getting test category manoeuvres';

  public getManoeuvresByCategoryCode(category: CategoryCode): (testData: TestDataUnion) => ManoeuvreUnion {
    switch (category) {
      case TestCategory.C:
      case TestCategory.C1:
      case TestCategory.CE:
      case TestCategory.C1E: return getManoeuvresC;
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.DE:
      case TestCategory.D1E: return getManoeuvresD;
      case TestCategory.F:
      case TestCategory.G:
      case TestCategory.H:
      case TestCategory.K: return getManoeuvresHomeTest;

      default: throw new Error(ManoeuvresByCategoryProvider.getManoeuvresByCategoryCodeErrMsg);
    }
  }
}

import { Injectable } from '@angular/core';
import { CategoryCode } from '@dvsa/mes-test-schema/categories/common';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getTestData as getTestDataC } from '@store/tests/test-data/cat-c/test-data.cat-c.reducer';
import { getTestData as getTestDataC1 } from '@store/tests/test-data/cat-c/test-data.cat-c1.reducer';
import { getTestData as getTestDataCE } from '@store/tests/test-data/cat-c/test-data.cat-ce.reducer';
import { getTestData as getTestDataC1E } from '@store/tests/test-data/cat-c/test-data.cat-c1e.reducer';
import { getTestData as getTestDataCatBE } from '@store/tests/test-data/cat-be/test-data.cat-be.reducer';
import { getTestData as getTestDataCatD } from '@store/tests/test-data/cat-d/test-data.cat-d.reducer';
import { getTestData as getTestDataCatD1 } from '@store/tests/test-data/cat-d/test-data.cat-d1.reducer';
import { getTestData as getTestDataCatDE } from '@store/tests/test-data/cat-d/test-data.cat-de.reducer';
import { getTestData as getTestDataCatD1E } from '@store/tests/test-data/cat-d/test-data.cat-d1e.reducer';
import { getTestData as getTestDataCatF } from '@store/tests/test-data/cat-home/test-data.cat-f.reducer';
import { getTestData as getTestDataCatG } from '@store/tests/test-data/cat-home/test-data.cat-g.reducer';
import { getTestData as getTestDataCatH } from '@store/tests/test-data/cat-home/test-data.cat-h.reducer';
import { getTestData as getTestDataCatK } from '@store/tests/test-data/cat-home/test-data.cat-k.reducer';
import { getTestData as getTestDataCatB } from '@store/tests/test-data/cat-b/test-data.reducer';
import {
  getTestData as getTestDataCatADI2,
} from '@store/tests/test-data/cat-adi-part2/test-data.cat-adi-part2.reducer';

@Injectable()
export class TestDataByCategoryProvider {

  static getTestDataByCategoryCodeErrMsg: string = 'Error getting test category';

  public getTestDataByCategoryCode(category: CategoryCode) {
    switch (category) {
      case TestCategory.ADI2: return getTestDataCatADI2;
      case TestCategory.B: return getTestDataCatB;
      case TestCategory.BE: return getTestDataCatBE;
      case TestCategory.C: return getTestDataC;
      case TestCategory.C1: return getTestDataC1;
      case TestCategory.CE: return getTestDataCE;
      case TestCategory.C1E: return getTestDataC1E;
      case TestCategory.D: return getTestDataCatD;
      case TestCategory.D1: return getTestDataCatD1;
      case TestCategory.DE: return getTestDataCatDE;
      case TestCategory.D1E: return getTestDataCatD1E;
      case TestCategory.F: return getTestDataCatF;
      case TestCategory.G: return getTestDataCatG;
      case TestCategory.H: return getTestDataCatH;
      case TestCategory.K: return getTestDataCatK;
      default: throw new Error(TestDataByCategoryProvider.getTestDataByCategoryCodeErrMsg);
    }
  }
}

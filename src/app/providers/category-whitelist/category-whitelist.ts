import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Injectable } from '@angular/core';

// list all test categories that are able to be started by the users
export const whiteList: TestCategory[] = [
  TestCategory.ADI2,
  TestCategory.B,
  TestCategory.C,
  TestCategory.C1,
  TestCategory.CE,
  TestCategory.C1E,
  TestCategory.CCPC,
  TestCategory.DCPC,
  TestCategory.D,
  TestCategory.D1,
  TestCategory.D1E,
  TestCategory.DE,
  TestCategory.EUAM1,
  TestCategory.EUA1M1,
  TestCategory.EUA2M1,
  TestCategory.EUAMM1,
  TestCategory.EUAMM2,
  TestCategory.EUA1M2,
  TestCategory.EUA2M2,
  TestCategory.EUAM2,
];

@Injectable()
export class CategoryWhitelistProvider {

  /**
   * Function to check if the passed in Category exists in the category whitelist
   * @param category
   */
  isWhiteListed(category: TestCategory): boolean {
    return whiteList.some((cat) => {
      return cat === category;
    });
  }
}

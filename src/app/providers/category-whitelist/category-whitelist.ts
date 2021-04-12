import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Injectable } from '@angular/core';

// list all test categories that are able to be started by the users
export const whiteList : TestCategory[] = [
  TestCategory.B,
  TestCategory.ADI2,
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

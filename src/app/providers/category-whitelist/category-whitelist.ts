import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryWhitelistProvider {

  /**
   * Function to check if the passed in Category exists in the category whitelist
   * @param category
   */
  isWhiteListed(category: TestCategory, whiteList: TestCategory[]): boolean {
    return whiteList.some((cat) => {
      return cat === category;
    });
  }
}

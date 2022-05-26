import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getPageNameByCategoryAndKey, PageNameKeys } from '@pages/page-names.constants';

@Injectable()
export class RouteByCategoryProvider {
  constructor(
    public router: Router,
  ) {
  }

  async navigateToPage(page: PageNameKeys, category?: TestCategory, navExtras: NavigationExtras = {}): Promise<void> {
    const categoryPage: string = category ? getPageNameByCategoryAndKey(category, page) : page;
    await this.router.navigate([categoryPage], navExtras);
  }

  getNextPage(page: PageNameKeys, category?: TestCategory): string {
    return category ? getPageNameByCategoryAndKey(category, page) : page;
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getPageNameByCategoryAndKey } from '../../pages/page-names.constants';

@Injectable()
export class RouteByCategoryProvider {
  constructor(
    private router: Router,
  ) {
  }

  async navigateToPage(page, category: TestCategory) {
    const { config } = this.router;
    const categoryPage =  getPageNameByCategoryAndKey(category, page);
    const pageAlias = this.categoryToPage(category);
    const pageName = this.pagePath(page);
    config.push({
      path: categoryPage,
      loadChildren: () =>
        import(`../../pages/${pageName}/${pageAlias}/${pageName}.${pageAlias}.module`)
          .then((m) => m[`${categoryPage}Module`]),
    });
    await this.router.navigate([categoryPage]);
  }

  categoryToPage(category: TestCategory): string {
    switch (category as TestCategory) {
      case TestCategory.ADI2:
        return 'cat-adi-part2';
      case TestCategory.B:
        return 'cat-b';
      case TestCategory.BE:
        return 'cat-be';
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return 'cat-c';
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return 'cat-cpc';
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return 'cat-a-mod1';
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return 'cat-a-mod2';
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return 'cat-d';
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return 'cat-home-test';
      default:
    }
  }

  pagePath(page: string): string {
    switch (page) {
      case 'WAITING_ROOM_PAGE':
        return 'waiting-room';
      default:
    }
  }
}

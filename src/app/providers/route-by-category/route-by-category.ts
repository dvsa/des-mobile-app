import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Injectable()
export class RouteByCategoryProvider {
  constructor(
    private router: Router,
  ) {
  }

  async navigateToPage(page, category: TestCategory) {
    const { config } = this.router;
    const { pageAlias } = this.categoryToPage(category);
    const { pageName } = this.pagePath(category);
    config.push({
      path: page,
      loadChildren: () =>
        import(`../../pages/${pageName}/${pageAlias}/${pageName}.${pageAlias}/${pageName}.${pageAlias}.module`)
          .then((m) => m[`${page}Module`]),
    });

    // './pages/waiting-room/cat-adi-part2/waiting-room.cat-adi-part2.module'

    await this.router.navigate([page]);
  }

  categoryToPage(category: TestCategory) {
    switch (category as TestCategory) {
      case TestCategory.ADI2:
        return {
          pageAlias: 'cat-adi-part2',
        };
      case TestCategory.B:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.BE:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return {
          pageAlias: 'tbc',
        };
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return {
          pageAlias: 'tbc',
        };
      default:
    }
  }

  pagePath(category: TestCategory) {
    switch (category as TestCategory) {
      case TestCategory.ADI2:
        return {
          pageName: 'waiting-room',
        };
      case TestCategory.B:
        return {
          pageName: 'tbc',
        };
      case TestCategory.BE:
        return {
          pageName: 'tbc',
        };
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return {
          pageName: 'tbc',
        };
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return {
          pageName: 'tbc',
        };
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return {
          pageName: 'tbc',
        };
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return {
          pageName: 'tbc',
        };
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return {
          pageName: 'tbc',
        };
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return {
          pageName: 'tbc',
        };
      default:
    }
  }
}

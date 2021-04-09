import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

@Injectable()
export class RouteByCategoryProvider {
  constructor(
    private router: Router,
  ) {
  }

  navToWaitingRoom(page, category: TestCategory) {
    const { config } = this.router;
    const { pageAlias, moduleAlias } = this.categoryToPage(category);
    config.push({
      path: page,
      loadChildren: () =>
        import(`../../pages/waiting-room/${pageAlias}/waiting-room.${pageAlias}/waiting-room.${pageAlias}.module`)
          .then((m) => m[`WaitingRoom${moduleAlias}PageModule`]),
    });

    this.router.navigate([page]);
  }

  categoryToPage(category: TestCategory) {
    switch (category as TestCategory) {
      case TestCategory.ADI2:
        return {
          pageAlias: 'cat-adi-part2',
          moduleAlias: 'CatAdiPart2',
        };
      case TestCategory.B:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.BE:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.C1E:
      case TestCategory.CE:
      case TestCategory.C1:
      case TestCategory.C:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.CCPC:
      case TestCategory.DCPC:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.EUAM1:
      case TestCategory.EUA1M1:
      case TestCategory.EUA2M1:
      case TestCategory.EUAMM1:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.EUAM2:
      case TestCategory.EUA1M2:
      case TestCategory.EUA2M2:
      case TestCategory.EUAMM2:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.D:
      case TestCategory.D1:
      case TestCategory.D1E:
      case TestCategory.DE:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      case TestCategory.K:
      case TestCategory.H:
      case TestCategory.G:
      case TestCategory.F:
        return {
          pageAlias: 'tbc',
          moduleAlias: 'tbc',
        };
      default:
    }
  }

}

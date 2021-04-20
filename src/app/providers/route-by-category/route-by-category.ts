import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { getPageNameByCategoryAndKey, PageNameKeys } from '@pages/page-names.constants';

@Injectable()
export class RouteByCategoryProvider {
  constructor(
    public router: Router,
  ) {
  }

  async navigateToPage(page: PageNameKeys, category?: TestCategory): Promise<void> {
    console.log('page', page);
    console.log('category', category);
    const { config } = this.router;
    const categoryPage: string = category ? getPageNameByCategoryAndKey(category, page) : page;
    const pageAlias: string = this.getPageAliasByCategory(category);
    const pageName: string = this.getBasePagePathByCategory(page);
    const importPath: string = category
      ? `${pageName}/${pageAlias}/${pageName}.${pageAlias}`
      : `${pageName}/${pageName}`;
    console.log('importPath', importPath);
    console.log('categoryPage', categoryPage);
    config.push({
      path: categoryPage,
      loadChildren: () =>
        import(`../../pages/${importPath}.module`)
          .then((m) => m[`${categoryPage}Module`]),
    });
    await this.router.navigate([categoryPage]);
  }

  getPageAliasByCategory(category: TestCategory): string {
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

  getBasePagePathByCategory(page: string): string {
    switch (page) {
      case 'WAITING_ROOM_PAGE':
        return 'waiting-room';
      case 'COMMUNICATION_PAGE':
        return 'communication';
      case 'WAITING_ROOM_TO_CAR_PAGE':
        return 'waiting-room-to-car';
      case 'TEST_REPORT_PAGE':
        return 'test-report';
      case 'DEBRIEF_PAGE':
        return 'debrief';
      case 'PASS_FINALISATION_PAGE':
        return 'pass-finalisation';
      case 'NON_PASS_FINALISATION_PAGE':
        return 'non-pass-finalisation';
      case 'POST_DEBRIEF_HOLDING_PAGE':
        return 'post-debrief-holding';
      case 'HEALTH_DECLARATION_PAGE':
        return 'health-declaration';
      case 'ConfirmTestDetailsPage':
        return 'confirm-test-details';
      case 'BACK_TO_OFFICE_PAGE':
        return 'back-to-office';
      case 'OFFICE_PAGE':
        return 'office';
      case 'REKEY_REASON_PAGE':
        return 'rekey-reason';
      case 'RekeyUploadOutcomePage':
        return 'rekey-upload-outcome';
      default:
    }
  }
}

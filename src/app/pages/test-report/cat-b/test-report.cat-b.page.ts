import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';

interface CatBTestReportPageState {}

type TestReportPageState = CommonTestReportPageState & CatBTestReportPageState;

@Component({
  selector: 'app-test-report-cat-b',
  templateUrl: './test-report.cat-b.page.html',
  styleUrls: ['./test-report.cat-b.page.scss'],
})
export class TestReportCatBPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(
    private navController: NavController,
    public routeByCat: RouteByCategoryProvider,
    store$: Store<StoreModel>,
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
  ) {
    super(store$, platform, authenticationProvider, router);
  }

  ngOnInit() {
    super.onInitialisation();
    this.pageState = {
      ...this.commonPageState,
    };
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.DEBRIEF_PAGE, TestCategory.B);
  }

}

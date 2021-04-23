import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Router } from '@angular/router';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import {
  CommonOfficePageState,
  OfficeBasePageComponent,
} from '@shared/classes/test-flow-base-pages/office/office-base-page';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';

import { JOURNAL_PAGE, TestFlowPageNames } from '../../page-names.constants';

interface CatBOfficePageState {}

type OfficePageState = CommonOfficePageState & CatBOfficePageState;

@Component({
  selector: 'app-office-cat-b',
  templateUrl: './office.cat-b.page.html',
  styleUrls: ['./office.cat-b.page.scss'],
})
export class OfficeCatBPage extends OfficeBasePageComponent implements OnInit {

  pageState: OfficePageState;

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.REKEY_REASON_PAGE, TestCategory.B);
  }

  async navigateJournal(): Promise<void> {
    await this.router.navigate([JOURNAL_PAGE]);
  }

}

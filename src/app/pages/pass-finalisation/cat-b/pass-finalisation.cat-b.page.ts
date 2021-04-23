import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  CommonPassFinalisationPageState,
  PassFinalisationPageComponent,
} from '@shared/classes/test-flow-base-pages/pass-finalisation/pass-finalisation-base-page';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Router } from '@angular/router';

interface CatBPassFinalisationPageState {}

type PassFinalisationPageState = CommonPassFinalisationPageState & CatBPassFinalisationPageState;

@Component({
  selector: 'app-pass-finalisation-cat-b',
  templateUrl: './pass-finalisation.cat-b.page.html',
  styleUrls: ['./pass-finalisation.cat-b.page.scss'],
})
export class PassFinalisationCatBPage extends PassFinalisationPageComponent implements OnInit {

  pageState: PassFinalisationPageState;

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
    await this.routeByCat.navigateToPage(TestFlowPageNames.HEALTH_DECLARATION_PAGE, TestCategory.B);
  }

}

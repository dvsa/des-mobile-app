import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { TestFlowPageNames } from '@pages/page-names.constants';
import { StoreModel } from '@shared/models/store.model';
import {
  CommonWaitingRoomToCarPageState,
  WaitingRoomToCarBasePageComponent,
} from '@shared/classes/test-flow-base-pages/waiting-room-to-car/waiting-room-to-car-base-page';

interface CatBWaitingRoomToCarPageState {}

type WaitingRoomToCarPageState = CommonWaitingRoomToCarPageState & CatBWaitingRoomToCarPageState;

@Component({
  selector: 'app-waiting-room-to-car-cat-b',
  templateUrl: './waiting-room-to-car.cat-b.page.html',
  styleUrls: ['./waiting-room-to-car.cat-b.page.scss'],
})
export class WaitingRoomToCarCatBPage extends WaitingRoomToCarBasePageComponent implements OnInit {

  pageState = { ...this.commonPageState } as WaitingRoomToCarPageState;

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
    super.ngOnInit();
  }

  ionViewDidEnter(): void {
    super.ionViewDidEnter();
  }

  ionViewWillLeave(): void {
    super.ionViewWillLeave();
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.TEST_REPORT_PAGE, TestCategory.B);
  }

}

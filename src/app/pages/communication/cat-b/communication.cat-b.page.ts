import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { StoreModel } from '@shared/models/store.model';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestFlowPageNames } from '@pages/page-names.constants';
import {
  CommonCommunicationPageState,
  CommunicationBasePageComponent,
} from '@shared/classes/test-flow-base-pages/communication/communication-base-page';

interface CatBCommunicationPageState {}

type CommunicationPageState = CommonCommunicationPageState & CatBCommunicationPageState;

@Component({
  selector: 'app-communication-cat-b',
  templateUrl: './communication.cat-b.page.html',
  styleUrls: ['./communication.cat-b.page.scss'],
})
export class CommunicationCatBPage extends CommunicationBasePageComponent implements OnInit {

  pageState = { ...this.commonPageState } as CommunicationPageState;

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

  ionViewWillEnter(): boolean {
    super.ionViewWillEnter();
    return true;
  }

  ionViewDidLeave() {
    super.ionViewDidLeave();
  }

  navigateBack(): void {
    this.navController.back();
  }

  async navigateForward(): Promise<void> {
    await this.routeByCat.navigateToPage(TestFlowPageNames.WAITING_ROOM_TO_CAR_PAGE, TestCategory.B);
  }

}

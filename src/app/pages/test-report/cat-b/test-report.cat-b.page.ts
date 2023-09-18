import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { CatBUniqueTypes } from '@dvsa/mes-test-schema/categories/B';
import { Router } from '@angular/router';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-b-page',
  templateUrl: 'test-report.cat-b.page.html',
  styleUrls: ['test-report.cat-b.page.scss'],
})
export class TestReportCatBPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    routeByCategory: RouteByCategoryProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      routeByCategory,
    );
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatBUniqueTypes.TestData>,
    };
    this.setupSubscription();
  }

  async ionViewWillEnter(): Promise<void> {
    await super.ionViewWillEnter();
  }

  ionViewDidEnter(): void {
    super.ionViewDidEnter();
  }

  async ionViewWillLeave(): Promise<void> {
    await super.ionViewWillLeave();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }
}

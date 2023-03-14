import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { Store } from '@ngrx/store';
import { StoreModel } from '@shared/models/store.model';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Observable } from 'rxjs';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { CatDUniqueTypes } from '@dvsa/mes-test-schema/categories/D';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-d-page',
  templateUrl: './test-report.cat-d.page.html',
  styleUrls: ['./test-report.cat-d.page.scss'],
})
export class TestReportCatDPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
    screenOrientation: ScreenOrientation,
    insomnia: Insomnia,
    routeByCategory: RouteByCategoryProvider,
  ) {
    super(
      platform,
      authenticationProvider,
      router,
      store$,
      modalController,
      testReportValidatorProvider,
      screenOrientation,
      insomnia,
      routeByCategory,
    );
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatDUniqueTypes.TestData>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

  showUncoupleRecouple = (): boolean => {
    if (!this.delegatedTest) {
      return false;
    }
    return this.testCategory === TestCategory.DE || this.testCategory === TestCategory.D1E;
  };

}

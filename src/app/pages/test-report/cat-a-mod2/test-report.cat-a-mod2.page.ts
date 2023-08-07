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
import { Insomnia } from '@awesome-cordova-plugins/insomnia/ngx';
import { Observable } from 'rxjs';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { TestData } from '@dvsa/mes-test-schema/categories/AM2';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-a-mod2-page',
  templateUrl: './test-report.cat-a-mod2.page.html',
  styleUrls: ['./test-report.cat-a-mod2.page.scss'],
})
export class TestReportCatAMod2Page extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(
    platform: Platform,
    authenticationProvider: AuthenticationProvider,
    router: Router,
    store$: Store<StoreModel>,
    modalController: ModalController,
    testReportValidatorProvider: TestReportValidatorProvider,
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
      insomnia,
      routeByCategory,
    );
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<TestData>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.cancelSubscription();
  }

}

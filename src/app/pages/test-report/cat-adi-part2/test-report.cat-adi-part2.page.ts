import { Component, OnInit } from '@angular/core';
import {
  Platform,
  ModalController,
} from '@ionic/angular';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AuthenticationProvider } from '@providers/authentication/authentication';
import { StoreModel } from '@shared/models/store.model';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Insomnia } from '@ionic-native/insomnia/ngx';
import { Router } from '@angular/router';
import { TestReportValidatorProvider } from '@providers/test-report-validator/test-report-validator';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { RouteByCategoryProvider } from '@providers/route-by-category/route-by-category';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

interface CatADI2TestReportPageState {}
type TestReportPageState = CommonTestReportPageState & CatADI2TestReportPageState;

@Component({
  selector: '.test-report.cat-adi-part2-page',
  templateUrl: 'test-report.cat-adi-part2.page.html',
  styleUrls: ['test-report.cat-adi-part2.page.scss'],
})
export class TestReportCatADIPart2Page extends TestReportBasePageComponent implements OnInit {

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
      testData$: this.commonPageState.testData$ as Observable<CatADI2UniqueTypes.TestData>,
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


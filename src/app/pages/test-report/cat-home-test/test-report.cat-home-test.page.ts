import { Component, Injector, OnInit } from '@angular/core';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { CatFUniqueTypes } from '@dvsa/mes-test-schema/categories/F';
import { CatGUniqueTypes } from '@dvsa/mes-test-schema/categories/G';
import { CatHUniqueTypes } from '@dvsa/mes-test-schema/categories/H';
import { CatKUniqueTypes } from '@dvsa/mes-test-schema/categories/K';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

type TestReportPageState = CommonTestReportPageState;

type HomeCatTestDataUnion =
  CatFUniqueTypes.TestData |
  CatGUniqueTypes.TestData |
  CatHUniqueTypes.TestData |
  CatKUniqueTypes.TestData;

@Component({
  selector: '.test-report-cat-home-test-page',
  templateUrl: './test-report.cat-home-test.page.html',
  styleUrls: ['./test-report.cat-home-test.page.scss'],
})
export class TestReportCatHomeTestPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<HomeCatTestDataUnion>,
    };
    this.setupSubscription();
  }

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

  showManoeuvreButton = (): boolean => {
    return this.testCategory !== TestCategory.K;
  };

}

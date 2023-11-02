import { Component, Injector, OnInit } from '@angular/core';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
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

  constructor(injector: Injector) {
    super(injector);
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

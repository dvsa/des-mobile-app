import { Component, Injector, OnInit } from '@angular/core';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { CatCUniqueTypes } from '@dvsa/mes-test-schema/categories/C';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-c-page',
  templateUrl: './test-report.cat-c.page.html',
  styleUrls: ['./test-report.cat-c.page.scss'],
})
export class TestReportCatCPage extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();

    this.pageState = {
      ...this.commonPageState,
      testData$: this.commonPageState.testData$ as Observable<CatCUniqueTypes.TestData>,
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
    return this.testCategory === TestCategory.CE || this.testCategory === TestCategory.C1E;
  };

}

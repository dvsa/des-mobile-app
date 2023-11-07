import { Component, Injector, OnInit } from '@angular/core';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { TestData } from '@dvsa/mes-test-schema/categories/AM2';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-a-mod2-page',
  templateUrl: './test-report.cat-a-mod2.page.html',
  styleUrls: ['./test-report.cat-a-mod2.page.scss'],
})
export class TestReportCatAMod2Page extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
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
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

}

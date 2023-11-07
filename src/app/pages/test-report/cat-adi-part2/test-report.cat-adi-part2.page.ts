import { Component, Injector, OnInit } from '@angular/core';
import {
  CommonTestReportPageState,
  TestReportBasePageComponent,
} from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';
import { Observable } from 'rxjs';
import { CatADI2UniqueTypes } from '@dvsa/mes-test-schema/categories/ADI2';

type TestReportPageState = CommonTestReportPageState;

@Component({
  selector: '.test-report-cat-adi-part2-page',
  templateUrl: './test-report.cat-adi-part2.page.html',
  styleUrls: ['./test-report.cat-adi-part2.page.scss'],
})
export class TestReportCatADI2Page extends TestReportBasePageComponent implements OnInit {

  pageState: TestReportPageState;

  constructor(injector: Injector) {
    super(injector);
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

  ionViewDidLeave(): void {
    super.ionViewDidLeave();
    super.cancelSubscription();
  }

}

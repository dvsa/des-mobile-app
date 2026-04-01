import { Component, OnInit } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';

@Component({
  selector: '.test-report-cat-d-page',
  templateUrl: './test-report.cat-d.page.html',
  styleUrls: ['./test-report.cat-d.page.scss'],
  standalone: false,
})
export class TestReportCatDPage extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }

  showUncoupleRecouple = (): boolean => {
    if (!this.isDelegated) {
      return false;
    }
    return this.category === TestCategory.DE || this.category === TestCategory.D1E;
  };
}

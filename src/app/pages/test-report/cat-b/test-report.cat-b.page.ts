import { Component, OnInit } from '@angular/core';

import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';

@Component({
  selector: '.test-report-cat-b-page',
  templateUrl: 'test-report.cat-b.page.html',
  styleUrls: ['test-report.cat-b.page.scss'],
  standalone: false,
})
export class TestReportCatBPage extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }
}

import { Component, OnInit } from '@angular/core';
import { TestReportBasePageComponent } from '@shared/classes/test-flow-base-pages/test-report/test-report-base-page';

@Component({
  selector: '.test-report-cat-adi-part2-page',
  templateUrl: './test-report.cat-adi-part2.page.html',
  styleUrls: ['./test-report.cat-adi-part2.page.scss'],
  standalone: false,
})
export class TestReportCatADI2Page extends TestReportBasePageComponent implements OnInit {
  constructor() {
    super();
    this.displayOverlay = false;
  }

  ngOnInit(): void {
    super.onInitialisation();
  }
}

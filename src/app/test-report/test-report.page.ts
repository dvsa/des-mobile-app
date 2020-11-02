import { Component } from '@angular/core';

@Component({
  selector: 'app-test-report',
  templateUrl: 'test-report.page.html',
  styleUrls: ['test-report.page.scss'],
})
export class TestReportPage {

  faultCount: number;

  constructor() {
    this.faultCount = 0;
  }

  onPress($event) {
    this.faultCount += 1;
  }

}

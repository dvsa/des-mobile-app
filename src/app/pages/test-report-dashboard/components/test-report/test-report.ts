import { Component, Input } from '@angular/core';

@Component({
  selector: 'test-report',
  templateUrl: 'test-report.html',
  styleUrls: ['test-report.scss'],
})
export class TestReportComponent {
  @Input()
  testReportState: number;
}

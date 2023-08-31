import { Component, Input } from '@angular/core';
import { TestStatus } from '@store/tests/test-status/test-status.model';

@Component({
  selector: 'indicators',
  templateUrl: 'indicators.html',
  styleUrls: ['indicators.scss'],
})
export class IndicatorsComponent {

  @Input()
  showExclamationIndicator: boolean;

  @Input()
  testStatus: TestStatus;
  @Input()
  applicationId: number;

  shouldShowExclamationIndicator = (): boolean => {
    return !this.shouldShowGreenTickIndicator() && this.showExclamationIndicator;
  };

  shouldShowGreenTickIndicator = (): boolean => {
    return this.testStatus === TestStatus.Submitted;
  };
}

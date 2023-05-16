import { Component, Input } from '@angular/core';
import { TestOutcome } from '@store/tests/tests.constants';

@Component({
  selector: 'office-candidate-section',
  templateUrl: 'candidate-section.html',
})
export class CandidateSectionComponent {

  @Input()
  candidateName: string;

  @Input()
  driverNumber: string;

  @Input()
  startTime: string;

  @Input()
  testOutcomeText: TestOutcome;

  @Input()
  grade?: string;

  @Input()
  candidatePrnNumber: number;

  @Input()
  isStandardsCheck: boolean;

  public getTestOutcomeColour = (testOutcome: TestOutcome): string => {
    switch (testOutcome) {
      case TestOutcome.Passed:
        return 'var(--gds-dark-green-3)';
      case TestOutcome.Failed:
        return 'var(--gds-red)';
      case TestOutcome.Terminated:
        return 'var(--gds-grey-1)';
      default:
        return 'black';
    }
  };

}

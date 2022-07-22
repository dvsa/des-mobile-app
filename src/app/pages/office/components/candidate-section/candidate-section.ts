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

  public getTestOutcomeClass = (testOutcome: TestOutcome): string => {
    // eslint-disable-next-line default-case
    switch (testOutcome) {
      case TestOutcome.Passed:
        return 'pass';
      case TestOutcome.Failed:
        return 'fail';
      case TestOutcome.Terminated:
        return 'terminated';
    }
  };

}

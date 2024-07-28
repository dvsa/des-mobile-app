import { Component, Input } from '@angular/core';
import { TestStatus } from '@store/tests/test-status/test-status.model';

@Component({
  selector: 'additional-candidate-details',
  templateUrl: 'additional-candidate-details.html',
  styleUrls: ['additional-candidate-details.scss'],
})
export class AdditionalCandidateDetailsComponent {
  @Input()
  prn?: number = 0;

  @Input()
  testStatus: TestStatus;

  @Input()
  attempts?: number = 0;

  isCompleted(): boolean {
    return [TestStatus.Completed, TestStatus.Submitted].includes(this.testStatus);
  }
}

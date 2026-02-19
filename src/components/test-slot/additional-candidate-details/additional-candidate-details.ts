import { Component, Input } from '@angular/core';
import { TestCategory } from '@dvsa/mes-test-schema/category-definitions/common/test-category';
import { TestStatus } from '@store/tests/test-status/test-status.model';

@Component({
  selector: 'additional-candidate-details',
  templateUrl: 'additional-candidate-details.html',
  styleUrls: ['additional-candidate-details.scss'],
  standalone: false,
})
export class AdditionalCandidateDetailsComponent {
  @Input()
  prn?: number = 0;

  @Input()
  testStatus: TestStatus;

  @Input()
  attempts?: number = 0;

  @Input()
  category?: string = null;

  isSC(): boolean {
    return this.category === TestCategory.SC;
  }

  isCompleted(): boolean {
    return [TestStatus.Completed, TestStatus.Submitted].includes(this.testStatus);
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'test-finalisation-invalid-test-data-modal',
  templateUrl: 'test-finalisation-invalid-test-data-modal.html',
  styleUrls: ['test-finalisation-invalid-test-data-modal.scss'],
})
export class TestFinalisationInvalidTestDataModal {
  @Input()
  onCancel: Function;
  @Input()
  onReturnToTestReport: Function;
  @Input()
  message: string;

  constructor() {}
}

import { Component, Input } from '@angular/core';
import { IonButton, IonCard, IonCol, IonIcon, IonRow, IonText } from '@ionic/angular';

@Component({
  selector: 'test-finalisation-invalid-test-data-modal',
  templateUrl: 'test-finalisation-invalid-test-data-modal.html',
  styleUrls: ['test-finalisation-invalid-test-data-modal.scss'],
  imports: [IonCard, IonRow, IonCol, IonIcon, IonText, IonButton],
})
export class TestFinalisationInvalidTestDataModal {
  @Input()
  onCancel: Function;
  @Input()
  onReturnToTestReport: Function;
  @Input()
  message: string;
}

import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonIcon, IonRow, IonText } from '@ionic/angular';
import { TestFinalisationInvalidTestDataModal } from './test-finalisation-invalid-test-data-modal';

@NgModule({
  declarations: [TestFinalisationInvalidTestDataModal],

  exports: [TestFinalisationInvalidTestDataModal],
  imports: [IonRow, IonCol, IonText, IonIcon, IonCard, IonButton],
})
export class TestFinalisationInvalidTestDataModalModule {}

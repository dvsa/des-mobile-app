import { NgModule } from '@angular/core';

import { TestFinalisationInvalidTestDataModal } from './test-finalisation-invalid-test-data-modal';
import {IonButton, IonCard, IonCol, IonIcon, IonRow, IonText} from "@ionic/angular";

@NgModule({
    declarations: [TestFinalisationInvalidTestDataModal],

    exports: [TestFinalisationInvalidTestDataModal],
  imports: [
    IonRow,
    IonCol,
    IonText,
    IonIcon,
    IonCard,
    IonButton
  ]
})
export class TestFinalisationInvalidTestDataModalModule {}

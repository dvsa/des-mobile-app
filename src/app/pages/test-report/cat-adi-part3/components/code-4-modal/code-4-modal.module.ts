import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonRow } from '@ionic/angular';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';

@NgModule({
  exports: [Code4Modal],
  imports: [CommonModule, IonCol, IonRow, IonButton, IonCard, Code4Modal],
})
export class Code4ModalModule {}

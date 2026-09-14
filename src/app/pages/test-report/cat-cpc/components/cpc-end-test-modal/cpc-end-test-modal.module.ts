import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { IonButton, IonCard, IonCol, IonGrid, IonRow, IonText } from '@ionic/angular';
import { ModalResultItemComponent } from './components/modal-result-item/modal-result-item';
import { CPCEndTestModal } from './cpc-end-test-modal';

@NgModule({
  declarations: [CPCEndTestModal, ModalResultItemComponent],
  exports: [CPCEndTestModal, ModalResultItemComponent],
  imports: [CommonModule, NgOptimizedImage, IonCard, IonRow, IonCol, IonText, IonButton, IonGrid],
})
export class CPCEndTestModalModule {}

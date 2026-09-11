import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalResultItemComponent } from './components/modal-result-item/modal-result-item';
import { CPCEndTestModal } from './cpc-end-test-modal';
import {IonButton, IonCard, IonCol, IonRow, IonText} from "@ionic/angular";

@NgModule({
  declarations: [CPCEndTestModal, ModalResultItemComponent],
  exports: [CPCEndTestModal, ModalResultItemComponent],
  imports: [CommonModule, NgOptimizedImage, IonCard, IonRow, IonCol, IonText, IonButton],
})
export class CPCEndTestModalModule {}

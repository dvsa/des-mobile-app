import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { CPCEndTestModal } from './cpc-end-test-modal';
import { ModalResultItemComponent } from './components/modal-result-item/modal-result-item';

@NgModule({
  declarations: [
    CPCEndTestModal,
    ModalResultItemComponent,
  ],
  exports: [
    CPCEndTestModal,
    ModalResultItemComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
})
export class CPCEndTestModalModule { }

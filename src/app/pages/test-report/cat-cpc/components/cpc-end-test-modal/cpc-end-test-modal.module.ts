import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ModalResultItemComponent } from './components/modal-result-item/modal-result-item';
import { CPCEndTestModal } from './cpc-end-test-modal';

@NgModule({
  declarations: [CPCEndTestModal, ModalResultItemComponent],
  exports: [CPCEndTestModal, ModalResultItemComponent],
  imports: [IonicModule, CommonModule, NgOptimizedImage],
})
export class CPCEndTestModalModule {}

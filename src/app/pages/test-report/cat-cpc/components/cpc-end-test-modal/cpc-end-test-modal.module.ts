import { CommonModule, NgOptimizedImage } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalResultItemComponent } from './components/modal-result-item/modal-result-item';
import { CPCEndTestModal } from './cpc-end-test-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [CPCEndTestModal, ModalResultItemComponent],
  exports: [CPCEndTestModal, ModalResultItemComponent],
  imports: [IonicComponentsModule, CommonModule, NgOptimizedImage],
})
export class CPCEndTestModalModule {}

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Adi3EndTestModal } from './adi3-end-test-modal';
import {
  CPCEndTestModalModule
} from '@pages/test-report/cat-cpc/components/cpc-end-test-modal/cpc-end-test-modal.module';
// import { ModalResultItemComponent } from './components/modal-result-item/modal-result-item';

@NgModule({
  declarations: [
    Adi3EndTestModal,
    // ModalResultItemComponent,
  ],
  exports: [
    Adi3EndTestModal,
    // ModalResultItemComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    CPCEndTestModalModule
  ]
})
export class Adi3EndTestModalModule {}

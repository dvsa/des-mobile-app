import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ComponentsModule } from '@components/common/common-components.module';
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
    NgOptimizedImage,
    ComponentsModule,
  ],
})
export class CPCEndTestModalModule { }

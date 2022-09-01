import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Code4Modal } from '@pages/test-report/cat-adi-part3/components/code-4-modal/code-4-modal';

@NgModule({
  declarations: [
    Code4Modal,
  ],
  exports: [
    Code4Modal,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
})
export class Code4ModalModule {}

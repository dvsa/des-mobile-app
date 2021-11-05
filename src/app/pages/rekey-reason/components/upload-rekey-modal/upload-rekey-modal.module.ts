import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { UploadRekeyModal } from './upload-rekey-modal';

@NgModule({
  declarations: [
    UploadRekeyModal,
  ],
  imports: [
    IonicModule,
    CommonModule,
  ],
  exports: [
    UploadRekeyModal,
  ],
})
export class UploadRekeyModalModule { }

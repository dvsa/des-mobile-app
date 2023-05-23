import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { HeaderComponentModule } from '@components/common/header-component/header-component.module';
import { UploadRekeyModal } from './upload-rekey-modal';

@NgModule({
  declarations: [
    UploadRekeyModal,
  ],
  imports: [
    IonicModule,
    CommonModule,
    HeaderComponentModule,
  ],
  exports: [
    UploadRekeyModal,
  ],
})
export class UploadRekeyModalModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UploadRekeyModal } from './upload-rekey-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [UploadRekeyModal],
  imports: [IonicComponentsModule, CommonModule],
  exports: [UploadRekeyModal],
})
export class UploadRekeyModalModule {}

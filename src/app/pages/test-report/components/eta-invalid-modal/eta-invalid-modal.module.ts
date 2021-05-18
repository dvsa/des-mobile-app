import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EtaInvalidModal } from './eta-invalid-modal';
import { ComponentsModule } from '../../../../components/common/common-components.module';

@NgModule({
  declarations: [
    EtaInvalidModal,
  ],
  imports: [
    IonicPageModule.forChild(EtaInvalidModal),
    ComponentsModule,
  ],
  exports: [
    EtaInvalidModal,
  ],
})
export class EtaInvalidModalModule { }

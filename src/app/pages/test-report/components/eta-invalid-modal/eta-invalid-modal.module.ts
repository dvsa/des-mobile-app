import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { EtaInvalidModal } from './eta-invalid-modal';

@NgModule({
  declarations: [
    EtaInvalidModal,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
  ],
  exports: [
    EtaInvalidModal,
  ],
})
export class EtaInvalidModalModule { }

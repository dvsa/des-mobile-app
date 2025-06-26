import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { EtaInvalidModal } from './eta-invalid-modal';

@NgModule({
  declarations: [EtaInvalidModal],
  imports: [ComponentsModule, IonicModule, ModalAlertTitleComponent],
  exports: [EtaInvalidModal],
})
export class EtaInvalidModalModule {}

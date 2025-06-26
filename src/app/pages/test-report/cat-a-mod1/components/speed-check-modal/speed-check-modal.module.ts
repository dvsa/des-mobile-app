import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { SpeedCheckModal } from './speed-check-modal';

@NgModule({
  declarations: [SpeedCheckModal],
  imports: [IonicModule, ComponentsModule, CommonModule, ModalAlertTitleComponent],
  exports: [SpeedCheckModal],
})
export class SpeedCheckModalModule {}

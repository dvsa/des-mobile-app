import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ModalAlertTitleComponent } from '@components/common/modal-alert-title/modal-alert-title';
import { IonicModule } from '@ionic/angular';
import { ActivityCode4Modal } from './activity-code-4-modal';

@NgModule({
  declarations: [ActivityCode4Modal],
  imports: [ComponentsModule, IonicModule, ModalAlertTitleComponent],
  exports: [ActivityCode4Modal],
})
export class ActivityCode4ModalModule {}

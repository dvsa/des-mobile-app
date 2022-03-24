import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ActivityCode4Modal } from './activity-code-4-modal';

@NgModule({
  declarations: [
    ActivityCode4Modal,
  ],
  imports: [
    ComponentsModule,
    IonicModule,
  ],
  exports: [
    ActivityCode4Modal,
  ],
})
export class ActivityCode4ModalModule { }

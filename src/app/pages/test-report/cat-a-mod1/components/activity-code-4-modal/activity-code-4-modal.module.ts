import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { ActivityCode4Modal } from './activity-code-4-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [ActivityCode4Modal],
  imports: [IonicComponentsModule, ComponentsModule],
  exports: [ActivityCode4Modal],
})
export class ActivityCode4ModalModule {}

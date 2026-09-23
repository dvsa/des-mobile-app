import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { EtaInvalidModal } from './eta-invalid-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [EtaInvalidModal],
  imports: [IonicComponentsModule, ComponentsModule],
  exports: [EtaInvalidModal],
})
export class EtaInvalidModalModule {}

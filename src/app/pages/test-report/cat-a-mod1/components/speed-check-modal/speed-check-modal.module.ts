import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';
import { SpeedCheckModal } from './speed-check-modal';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [SpeedCheckModal],
  imports: [IonicComponentsModule, ComponentsModule, CommonModule],
  exports: [SpeedCheckModal],
})
export class SpeedCheckModalModule {}

import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { CommonModule } from '@angular/common';
import { SpeedCheckModal } from './speed-check-modal';

@NgModule({
  declarations: [
    SpeedCheckModal,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    CommonModule,
  ],
  exports: [
    SpeedCheckModal,
  ],
})
export class SpeedCheckModalModule { }

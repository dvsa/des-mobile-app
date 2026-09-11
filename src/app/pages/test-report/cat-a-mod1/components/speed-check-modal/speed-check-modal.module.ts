import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { SpeedCheckModal } from './speed-check-modal';
import {IonButton, IonCard, IonCol, IonRow} from "@ionic/angular";

@NgModule({
  declarations: [SpeedCheckModal],
  imports: [ComponentsModule, CommonModule, IonCol, IonRow, IonCard, IonButton],
  exports: [SpeedCheckModal],
})
export class SpeedCheckModalModule {}

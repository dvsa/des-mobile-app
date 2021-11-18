import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import {
  WaitingRoomToCarCatCComponentsModule,
} from '@pages/waiting-room-to-car/cat-c/components/waiting-room-to-car.cat-c.components.module';
import { WaitingRoomToCarCatCPageRoutingModule } from './waiting-room-to-car.cat-c-routing.module';
import { WaitingRoomToCarCatCPage } from './waiting-room-to-car.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatCPageRoutingModule,
    WaitingRoomToCarCatCComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
  ],
  declarations: [WaitingRoomToCarCatCPage],
})
export class WaitingRoomToCarCatCPageModule {}

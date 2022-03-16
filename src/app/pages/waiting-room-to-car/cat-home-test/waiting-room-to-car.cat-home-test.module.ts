import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarCatHomeComponentsModule,
} from '@pages/waiting-room-to-car/cat-home-test/components/waiting-room-to-car-.cat-home.components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarCatHomeTestPageRoutingModule } from './waiting-room-to-car.cat-home-test-routing.module';

import { WaitingRoomToCarCatHomeTestPage } from './waiting-room-to-car.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatHomeTestPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarCatHomeComponentsModule,
    WaitingRoomToCarComponentsModule,
  ],
  declarations: [WaitingRoomToCarCatHomeTestPage],
})
export class WaitingRoomToCarCatHomeTestPageModule {}

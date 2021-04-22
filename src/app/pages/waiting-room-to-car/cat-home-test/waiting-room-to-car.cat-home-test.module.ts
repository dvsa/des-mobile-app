import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatHomeTestPageRoutingModule } from './waiting-room-to-car.cat-home-test-routing.module';

import { WaitingRoomToCarCatHomeTestPage } from './waiting-room-to-car.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatHomeTestPageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatHomeTestPage],
})
export class WaitingRoomToCarCatHomeTestPageModule {}

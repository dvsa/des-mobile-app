import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatBEPageRoutingModule } from './waiting-room-to-car.cat-be-routing.module';

import { WaitingRoomToCarCatBEPage } from './waiting-room-to-car.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatBEPageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatBEPage],
})
export class WaitingRoomToCarCatBEPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatBePageRoutingModule } from './waiting-room-to-car.cat-be-routing.module';

import { WaitingRoomToCarCatBePage } from './waiting-room-to-car.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatBePageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatBePage],
})
export class WaitingRoomToCarCatBePageModule {}

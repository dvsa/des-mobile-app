import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatDPageRoutingModule } from './waiting-room-to-car.cat-d-routing.module';
import { WaitingRoomToCarCatDPage } from './waiting-room-to-car.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatDPageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatDPage],
})
export class WaitingRoomToCarCatDPageModule {}

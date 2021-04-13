import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatBPageRoutingModule } from './waiting-room-to-car.cat-b-routing.module';

import { WaitingRoomToCarCatBPage } from './waiting-room-to-car.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatBPageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatBPage],
})
export class WaitingRoomToCarCatBPageModule {}

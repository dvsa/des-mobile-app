import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCar.CatBePageRoutingModule } from './waiting-room-to-car.cat-be-routing.module';

import { WaitingRoomToCar.CatBePage } from './waiting-room-to-car.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCar.CatBePageRoutingModule
  ],
  declarations: [WaitingRoomToCar.CatBePage]
})
export class WaitingRoomToCar.CatBePageModule {}

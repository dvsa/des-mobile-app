import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatCPCPageRoutingModule } from './waiting-room-to-car.cat-cpc-routing.module';

import { WaitingRoomToCarCatCPCPage } from './waiting-room-to-car.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatCPCPageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatCPCPage],
})
export class WaitingRoomToCarCatCPCPageModule {}

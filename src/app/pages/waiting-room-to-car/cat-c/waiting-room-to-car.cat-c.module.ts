import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatCPageRoutingModule } from './waiting-room-to-car.cat-c-routing.module';
import { WaitingRoomToCarCatCPage } from './waiting-room-to-car.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatCPageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatCPage],
})
export class WaitingRoomToCarCatCPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatADIPart2PageRoutingModule } from './waiting-room-to-car.cat-adi-part2-routing.module';

import { WaitingRoomToCarCatAdiPart2Page } from './waiting-room-to-car.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatADIPart2PageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatAdiPart2Page],
})
export class WaitingRoomToCarCatADIPart2PageModule {}

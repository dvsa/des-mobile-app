import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatAMod2PageRoutingModule } from './waiting-room-to-car.cat-a-mod2-routing.module';
import { WaitingRoomToCarCatAMod2Page } from './waiting-room-to-car.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatAMod2PageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatAMod2Page],
})
export class WaitingRoomToCarCatAMod2PageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarCatAMod1PageRoutingModule } from './waiting-room-to-car.cat-a-mod1-routing.module';

import { WaitingRoomToCarCatAMod1Page } from './waiting-room-to-car.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatAMod1PageRoutingModule,
  ],
  declarations: [WaitingRoomToCarCatAMod1Page],
})
export class WaitingRoomToCarCatAMod1PageModule {}

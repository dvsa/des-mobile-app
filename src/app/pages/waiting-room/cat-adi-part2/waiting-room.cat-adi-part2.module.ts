import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatADIPart2PageRoutingModule } from './waiting-room.cat-adi-part2-routing.module';

import { WaitingRoomCatAdiPart2Page } from './waiting-room.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatADIPart2PageRoutingModule,
  ],
  declarations: [WaitingRoomCatAdiPart2Page],
})
export class WaitingRoomCatADIPart2PageModule {}

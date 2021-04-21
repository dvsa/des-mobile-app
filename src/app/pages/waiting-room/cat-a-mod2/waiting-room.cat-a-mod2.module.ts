import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatAMod2PageRoutingModule } from './waiting-room.cat-a-mod2-routing.module';
import { WaitingRoomCatAMod2Page } from './waiting-room.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatAMod2PageRoutingModule,
  ],
  declarations: [WaitingRoomCatAMod2Page],
})
export class WaitingRoomCatAMod2PageModule {}

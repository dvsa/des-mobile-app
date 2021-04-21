import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatAMod1PageRoutingModule } from './waiting-room.cat-a-mod1-routing.module';

import { WaitingRoomCatAMod1Page } from './waiting-room.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatAMod1PageRoutingModule,
  ],
  declarations: [WaitingRoomCatAMod1Page],
})
export class WaitingRoomCatAMod1PageModule {}

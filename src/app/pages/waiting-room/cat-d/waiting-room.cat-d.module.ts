import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatDPageRoutingModule } from './waiting-room.cat-d-routing.module';
import { WaitingRoomCatDPage } from './waiting-room.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatDPageRoutingModule,
  ],
  declarations: [WaitingRoomCatDPage],
})
export class WaitingRoomCatDPageModule {}

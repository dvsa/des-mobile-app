import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatBEPageRoutingModule } from './waiting-room.cat-be-routing.module';

import { WaitingRoomCatBEPage } from './waiting-room.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatBEPageRoutingModule,
  ],
  declarations: [WaitingRoomCatBEPage],
})
export class WaitingRoomCatBEPageModule {}

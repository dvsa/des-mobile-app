import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatBPageRoutingModule } from './waiting-room.cat-b-routing.module';

import { WaitingRoomCatBPage } from './waiting-room.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatBPageRoutingModule
  ],
  declarations: [WaitingRoomCatBPage]
})
export class WaitingRoomCatBPageModule {}

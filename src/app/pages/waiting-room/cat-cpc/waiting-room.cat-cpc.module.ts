import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatCPCPageRoutingModule } from './waiting-room.cat-cpc-routing.module';

import { WaitingRoomCatCPCPage } from './waiting-room.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatCPCPageRoutingModule,
  ],
  declarations: [WaitingRoomCatCPCPage],
})
export class WaitingRoomCatCPCPageModule {}

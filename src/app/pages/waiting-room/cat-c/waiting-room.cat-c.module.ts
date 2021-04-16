import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatCPageRoutingModule } from './waiting-room.cat-c-routing.module';
import { WaitingRoomCatCPage } from './waiting-room.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatCPageRoutingModule,
  ],
  declarations: [WaitingRoomCatCPage],
})
export class WaitingRoomCatCPageModule {}

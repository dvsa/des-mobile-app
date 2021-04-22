import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoomCatHomeTestPageRoutingModule } from './waiting-room.cat-home-test-routing.module';

import { WaitingRoomCatHomeTestPage } from './waiting-room.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomCatHomeTestPageRoutingModule,
  ],
  declarations: [WaitingRoomCatHomeTestPage],
})
export class WaitingRoomCatHomeTestPageModule {}

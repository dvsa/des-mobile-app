import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WaitingRoom.CatBePageRoutingModule } from './waiting-room.cat-be-routing.module';

import { WaitingRoom.CatBePage } from './waiting-room.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoom.CatBePageRoutingModule
  ],
  declarations: [WaitingRoom.CatBePage]
})
export class WaitingRoom.CatBePageModule {}

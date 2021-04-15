import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatBePageRoutingModule } from './debrief.cat-be-routing.module';

import { DebriefCatBePage } from './debrief.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatBePageRoutingModule
  ],
  declarations: [DebriefCatBePage]
})
export class DebriefCatBePageModule {}

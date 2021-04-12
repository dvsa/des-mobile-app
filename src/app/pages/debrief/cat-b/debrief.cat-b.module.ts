import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatBPageRoutingModule } from './debrief.cat-b-routing.module';

import { DebriefCatBPage } from './debrief.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatBPageRoutingModule
  ],
  declarations: [DebriefCatBPage]
})
export class DebriefCatBPageModule {}

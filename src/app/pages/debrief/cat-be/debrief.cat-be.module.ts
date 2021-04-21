import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatBEPageRoutingModule } from './debrief.cat-be-routing.module';

import { DebriefCatBEPage } from './debrief.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatBEPageRoutingModule,
  ],
  declarations: [DebriefCatBEPage],
})
export class DebriefCatBEPageModule {}

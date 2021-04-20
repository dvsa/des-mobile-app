import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DebriefCatDPageRoutingModule } from './debrief.cat-d-routing.module';
import { DebriefCatDPage } from './debrief.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatDPageRoutingModule,
  ],
  declarations: [DebriefCatDPage],
})
export class DebriefCatDPageModule {}

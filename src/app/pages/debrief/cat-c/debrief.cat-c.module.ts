import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DebriefCatCPageRoutingModule } from './debrief.cat-c-routing.module';
import { DebriefCatCPage } from './debrief.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatCPageRoutingModule,
  ],
  declarations: [DebriefCatCPage],
})
export class DebriefCatCPageModule {}

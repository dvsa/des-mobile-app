import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatHomeTestPageRoutingModule } from './debrief.cat-home-test-routing.module';

import { DebriefCatHomeTestPage } from './debrief.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatHomeTestPageRoutingModule,
  ],
  declarations: [DebriefCatHomeTestPage],
})
export class DebriefCatHomeTestPageModule {}

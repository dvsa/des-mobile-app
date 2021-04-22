import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatADIPart2PageRoutingModule } from './debrief.cat-adi-part2-routing.module';

import { DebriefCatAdiPart2Page } from './debrief.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatADIPart2PageRoutingModule,
  ],
  declarations: [DebriefCatAdiPart2Page],
})
export class DebriefCatADIPart2PageModule {}

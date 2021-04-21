import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DebriefCatAMod2PageRoutingModule } from './debrief.cat-a-mod2-routing.module';
import { DebriefCatAMod2Page } from './debrief.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatAMod2PageRoutingModule,
  ],
  declarations: [DebriefCatAMod2Page],
})
export class DebriefCatAMod2PageModule {}

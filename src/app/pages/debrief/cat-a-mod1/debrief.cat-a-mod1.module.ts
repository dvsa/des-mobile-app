import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatAMod1PageRoutingModule } from './debrief.cat-a-mod1-routing.module';

import { DebriefCatAMod1Page } from './debrief.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatAMod1PageRoutingModule,
  ],
  declarations: [DebriefCatAMod1Page],
})
export class DebriefCatAMod1PageModule {}

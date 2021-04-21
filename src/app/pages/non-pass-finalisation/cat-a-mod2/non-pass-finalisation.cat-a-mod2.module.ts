import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatAMod2PageRoutingModule } from './non-pass-finalisation.cat-a-mod2-routing.module';
import { NonPassFinalisationCatAMod2Page } from './non-pass-finalisation.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatAMod2PageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatAMod2Page],
})
export class NonPassFinalisationCatDPageModule {}

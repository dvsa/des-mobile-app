import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatAMod1PageRoutingModule } from './non-pass-finalisation.cat-a-mod1-routing.module';

import { NonPassFinalisationCatAMod1Page } from './non-pass-finalisation.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatAMod1PageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatAMod1Page],
})
export class NonPassFinalisationCatAMod1PageModule {}

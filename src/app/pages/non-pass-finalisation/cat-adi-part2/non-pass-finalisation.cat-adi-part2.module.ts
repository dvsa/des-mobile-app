import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatADIPart2PageRoutingModule } from './non-pass-finalisation.cat-adi-part2-routing.module';

import { NonPassFinalisationCatAdiPart2Page } from './non-pass-finalisation.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatADIPart2PageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatAdiPart2Page],
})
export class NonPassFinalisationCatADIPart2PageModule {}

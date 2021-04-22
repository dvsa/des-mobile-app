import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatADIPart2PageRoutingModule } from './pass-finalisation.cat-adi-part2-routing.module';

import { PassFinalisationCatAdiPart2Page } from './pass-finalisation.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatADIPart2PageRoutingModule,
  ],
  declarations: [PassFinalisationCatAdiPart2Page],
})
export class PassFinalisationCatADIPart2PageModule {}

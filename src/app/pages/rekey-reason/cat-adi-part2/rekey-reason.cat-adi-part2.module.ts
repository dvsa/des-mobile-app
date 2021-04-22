import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatADIPart2PageRoutingModule } from './rekey-reason.cat-adi-part2-routing.module';

import { RekeyReasonCatAdiPart2Page } from './rekey-reason.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatADIPart2PageRoutingModule,
  ],
  declarations: [RekeyReasonCatAdiPart2Page],
})
export class RekeyReasonCatADIPart2PageModule {}

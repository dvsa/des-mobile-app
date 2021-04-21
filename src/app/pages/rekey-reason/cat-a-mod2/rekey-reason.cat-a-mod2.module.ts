import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatAMod2PageRoutingModule } from './rekey-reason.cat-a-mod2-routing.module';
import { RekeyReasonCatAMod2Page } from './rekey-reason.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatAMod2PageRoutingModule,
  ],
  declarations: [RekeyReasonCatAMod2Page],
})
export class RekeyReasonCatAMod2PageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatAMod1PageRoutingModule } from './rekey-reason.cat-a-mod1-routing.module';

import { RekeyReasonCatAMod1Page } from './rekey-reason.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatAMod1PageRoutingModule,
  ],
  declarations: [RekeyReasonCatAMod1Page],
})
export class RekeyReasonCatAMod1PageModule {}

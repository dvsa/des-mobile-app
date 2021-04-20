import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatBEPageRoutingModule } from './rekey-reason.cat-be-routing.module';

import { RekeyReasonCatBEPage } from './rekey-reason.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatBEPageRoutingModule,
  ],
  declarations: [RekeyReasonCatBEPage],
})
export class RekeyReasonCatBEPageModule {}

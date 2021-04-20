import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatDPageRoutingModule } from './rekey-reason.cat-d-routing.module';
import { RekeyReasonCatDPage } from './rekey-reason.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatDPageRoutingModule,
  ],
  declarations: [RekeyReasonCatDPage],
})
export class RekeyReasonCatDPageModule {}

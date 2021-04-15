import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatBePageRoutingModule } from './rekey-reason.cat-be-routing.module';

import { RekeyReasonCatBePage } from './rekey-reason.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatBePageRoutingModule,
  ],
  declarations: [RekeyReasonCatBePage],
})
export class RekeyReasonCatBePageModule {}

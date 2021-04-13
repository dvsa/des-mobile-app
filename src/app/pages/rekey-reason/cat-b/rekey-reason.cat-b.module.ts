import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatBPageRoutingModule } from './rekey-reason.cat-b-routing.module';

import { RekeyReasonCatBPage } from './rekey-reason.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatBPageRoutingModule
  ],
  declarations: [RekeyReasonCatBPage]
})
export class RekeyReasonCatBPageModule {}

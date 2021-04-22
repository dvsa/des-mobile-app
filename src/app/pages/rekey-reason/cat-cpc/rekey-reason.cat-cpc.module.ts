import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatCPCPageRoutingModule } from './rekey-reason.cat-cpc-routing.module';

import { RekeyReasonCatCPCPage } from './rekey-reason.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatCPCPageRoutingModule,
  ],
  declarations: [RekeyReasonCatCPCPage],
})
export class RekeyReasonCatCPCPageModule {}

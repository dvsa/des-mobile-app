import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatHomeTestPageRoutingModule } from './rekey-reason.cat-home-test-routing.module';

import { RekeyReasonCatHomeTestPage } from './rekey-reason.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatHomeTestPageRoutingModule,
  ],
  declarations: [RekeyReasonCatHomeTestPage],
})
export class RekeyReasonCatHomeTestPageModule {}

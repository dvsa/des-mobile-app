import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { RekeyReasonCatCPageRoutingModule } from './rekey-reason.cat-c-routing.module';
import { RekeyReasonCatCPage } from './rekey-reason.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonCatCPageRoutingModule,
  ],
  declarations: [RekeyReasonCatCPage],
})
export class RekeyReasonCatCPageModule {}

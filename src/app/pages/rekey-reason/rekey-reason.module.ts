import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReasonPageRoutingModule } from './rekey-reason-routing.module';

import { RekeyReasonPage } from './rekey-reason.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReasonPageRoutingModule,
  ],
  declarations: [RekeyReasonPage],
})
export class RekeyReasonPageModule {}

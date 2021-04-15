import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RekeyReason.CatBePageRoutingModule } from './rekey-reason.cat-be-routing.module';

import { RekeyReason.CatBePage } from './rekey-reason.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RekeyReason.CatBePageRoutingModule
  ],
  declarations: [RekeyReason.CatBePage]
})
export class RekeyReason.CatBePageModule {}

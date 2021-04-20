import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatBEPageRoutingModule } from './non-pass-finalisation.cat-be-routing.module';

import { NonPassFinalisationCatBEPage } from './non-pass-finalisation.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatBEPageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatBEPage],
})
export class NonPassFinalisationCatBEPageModule {}

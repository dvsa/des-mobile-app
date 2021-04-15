import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatBePageRoutingModule } from './non-pass-finalisation.cat-be-routing.module';

import { NonPassFinalisationCatBePage } from './non-pass-finalisation.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatBePageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatBePage],
})
export class NonPassFinalisationCatBePageModule {}

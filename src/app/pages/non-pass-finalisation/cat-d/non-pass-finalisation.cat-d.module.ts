import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatDPageRoutingModule } from './non-pass-finalisation.cat-d-routing.module';
import { NonPassFinalisationCatDPage } from './non-pass-finalisation.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatDPageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatDPage],
})
export class NonPassFinalisationCatDPageModule {}

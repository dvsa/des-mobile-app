import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatHomeTestPageRoutingModule } from './non-pass-finalisation.cat-home-test-routing.module';

import { NonPassFinalisationCatHomeTestPage } from './non-pass-finalisation.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatHomeTestPageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatHomeTestPage],
})
export class NonPassFinalisationCatHomeTestPageModule {}

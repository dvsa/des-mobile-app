import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationPageRoutingModule } from './non-pass-finalisation-routing.module';

import { NonPassFinalisationPage } from './non-pass-finalisation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationPageRoutingModule,
  ],
  declarations: [NonPassFinalisationPage],
})
export class NonPassFinalisationPageModule {}

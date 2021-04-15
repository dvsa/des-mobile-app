import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatBPageRoutingModule } from './non-pass-finalisation.cat-b-routing.module';

import { NonPassFinalisationCatBPage } from './non-pass-finalisation.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatBPageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatBPage],
})
export class NonPassFinalisationCatBPageModule {}

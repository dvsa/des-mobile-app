import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatCPageRoutingModule } from './non-pass-finalisation.cat-c-routing.module';
import { NonPassFinalisationCatCPage } from './non-pass-finalisation.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatCPageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatCPage],
})
export class NonPassFinalisationCatCPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisationCatCPCPageRoutingModule } from './non-pass-finalisation.cat-cpc-routing.module';

import { NonPassFinalisationCatCPCPage } from './non-pass-finalisation.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisationCatCPCPageRoutingModule,
  ],
  declarations: [NonPassFinalisationCatCPCPage],
})
export class NonPassFinalisationCatCPCPageModule {}

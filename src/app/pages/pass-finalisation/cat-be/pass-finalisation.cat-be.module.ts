import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatBEPageRoutingModule } from './pass-finalisation.cat-be-routing.module';

import { PassFinalisationCatBEPage } from './pass-finalisation.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatBEPageRoutingModule,
  ],
  declarations: [PassFinalisationCatBEPage],
})
export class PassFinalisationCatBEPageModule {}

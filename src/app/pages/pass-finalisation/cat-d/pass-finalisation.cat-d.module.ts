import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatDPageRoutingModule } from './pass-finalisation.cat-d-routing.module';
import { PassFinalisationCatDPage } from './pass-finalisation.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatDPageRoutingModule,
  ],
  declarations: [PassFinalisationCatDPage],
})
export class PassFinalisationCatDPageModule {}

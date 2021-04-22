import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatHomeTestPageRoutingModule } from './pass-finalisation.cat-home-test-routing.module';

import { PassFinalisationCatHomeTestPage } from './pass-finalisation.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatHomeTestPageRoutingModule,
  ],
  declarations: [PassFinalisationCatHomeTestPage],
})
export class PassFinalisationCatHomeTestPageModule {}

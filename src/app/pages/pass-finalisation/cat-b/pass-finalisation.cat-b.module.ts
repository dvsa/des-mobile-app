import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatBPageRoutingModule } from './pass-finalisation.cat-b-routing.module';

import { PassFinalisationCatBPage } from './pass-finalisation.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatBPageRoutingModule,
  ],
  declarations: [PassFinalisationCatBPage],
})
export class PassFinalisationCatBPageModule {}

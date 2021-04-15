import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatBePageRoutingModule } from './pass-finalisation.cat-be-routing.module';

import { PassFinalisationCatBePage } from './pass-finalisation.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatBePageRoutingModule,
  ],
  declarations: [PassFinalisationCatBePage],
})
export class PassFinalisationCatBePageModule {}

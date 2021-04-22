import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatCPCPageRoutingModule } from './pass-finalisation.cat-cpc-routing.module';

import { PassFinalisationCatCPCPage } from './pass-finalisation.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatCPCPageRoutingModule,
  ],
  declarations: [PassFinalisationCatCPCPage],
})
export class PassFinalisationCatCPCPageModule {}

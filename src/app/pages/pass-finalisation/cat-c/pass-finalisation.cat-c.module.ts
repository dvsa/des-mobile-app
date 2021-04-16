import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatCPageRoutingModule } from './pass-finalisation.cat-c-routing.module';
import { PassFinalisationCatCPage } from './pass-finalisation.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatCPageRoutingModule,
  ],
  declarations: [PassFinalisationCatCPage],
})
export class PassFinalisationCatCPageModule {}

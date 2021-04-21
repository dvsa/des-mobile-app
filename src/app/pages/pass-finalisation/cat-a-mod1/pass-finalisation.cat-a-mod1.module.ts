import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatAMod1PageRoutingModule } from './pass-finalisation.cat-a-mod1-routing.module';
import { PassFinalisationCatAMod1Page } from './pass-finalisation.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatAMod1PageRoutingModule,
  ],
  declarations: [PassFinalisationCatAMod1Page],
})
export class PassFinalisationCatAMod1PageModule {}

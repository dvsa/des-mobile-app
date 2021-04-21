import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { PassFinalisationCatAMod2PageRoutingModule } from './pass-finalisation.cat-a-mod2-routing.module';
import { PassFinalisationCatAMod2Page } from './pass-finalisation.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatAMod2PageRoutingModule,
  ],
  declarations: [PassFinalisationCatAMod2Page],
})
export class PassFinalisationCatAMod2PageModule {}

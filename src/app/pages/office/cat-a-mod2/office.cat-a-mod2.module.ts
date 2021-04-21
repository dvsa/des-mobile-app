import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OfficeCatAMod2PageRoutingModule } from './office.cat-a-mod2-routing.module';
import { OfficeCatAMod2Page } from './office.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatAMod2PageRoutingModule,
  ],
  declarations: [OfficeCatAMod2Page],
})
export class OfficeCatAMod2PageModule {}

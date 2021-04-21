import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatAMod2PageRoutingModule } from './back-to-office.cat-a-mod2-routing.module';
import { BackToOfficeCatAMod2Page } from './back-to-office.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatAMod2PageRoutingModule,
  ],
  declarations: [BackToOfficeCatAMod2Page],
})
export class BackToOfficeCatAMod2PageModule {}

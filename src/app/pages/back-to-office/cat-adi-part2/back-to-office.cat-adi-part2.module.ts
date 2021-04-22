import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatADIPart2PageRoutingModule } from './back-to-office.cat-adi-part2-routing.module';

import { BackToOfficeCatAdiPart2Page } from './back-to-office.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatADIPart2PageRoutingModule,
  ],
  declarations: [BackToOfficeCatAdiPart2Page],
})
export class BackToOfficeCatADIPart2PageModule {}

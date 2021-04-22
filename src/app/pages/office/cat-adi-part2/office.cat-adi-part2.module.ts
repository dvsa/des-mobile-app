import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatADIPart2PageRoutingModule } from './office.cat-adi-part2-routing.module';

import { OfficeCatAdiPart2Page } from './office.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatADIPart2PageRoutingModule,
  ],
  declarations: [OfficeCatAdiPart2Page],
})
export class OfficeCatADIPart2PageModule {}

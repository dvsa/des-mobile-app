import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatADIPart2PageRoutingModule } from './communication.cat-adi-part2-routing.module';

import { CommunicationCatAdiPart2Page } from './communication.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatADIPart2PageRoutingModule,
  ],
  declarations: [CommunicationCatAdiPart2Page],
})
export class CommunicationCatADIPart2PageModule {}

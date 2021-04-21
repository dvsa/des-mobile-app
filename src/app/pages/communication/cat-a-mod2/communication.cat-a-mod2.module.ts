import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommunicationCatAMod2PageRoutingModule } from './communication.cat-a-mod2-routing.module';
import { CommunicationCatAMod2Page } from './communication.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatAMod2PageRoutingModule,
  ],
  declarations: [CommunicationCatAMod2Page],
})
export class CommunicationCatAMod2PageModule {}

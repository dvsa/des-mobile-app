import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatAMod1PageRoutingModule } from './communication.cat-a-mod1-routing.module';

import { CommunicationCatAMod1Page } from './communication.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatAMod1PageRoutingModule,
  ],
  declarations: [CommunicationCatAMod1Page],
})
export class CommunicationCatAMod1PageModule {}

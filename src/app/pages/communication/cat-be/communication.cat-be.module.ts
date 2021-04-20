import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatBEPageRoutingModule } from './communication.cat-be-routing.module';

import { CommunicationCatBEPage } from './communication.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatBEPageRoutingModule,
  ],
  declarations: [CommunicationCatBEPage],
})
export class CommunicationCatBEPageModule {}

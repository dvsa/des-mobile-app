import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommunicationCatDPageRoutingModule } from './communication.cat-d-routing.module';
import { CommunicationCatDPage } from './communication.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatDPageRoutingModule,
  ],
  declarations: [CommunicationCatDPage],
})
export class CommunicationCatDPageModule {}

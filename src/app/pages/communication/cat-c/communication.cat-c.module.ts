import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CommunicationCatCPageRoutingModule } from './communication.cat-c-routing.module';
import { CommunicationCatCPage } from './communication.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatCPageRoutingModule,
  ],
  declarations: [CommunicationCatCPage],
})
export class CommunicationCatCPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatCPCPageRoutingModule } from './communication.cat-cpc-routing.module';

import { CommunicationCatCPCPage } from './communication.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatCPCPageRoutingModule,
  ],
  declarations: [CommunicationCatCPCPage],
})
export class CommunicationCatCPCPageModule {}

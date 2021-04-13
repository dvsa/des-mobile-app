import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatBPageRoutingModule } from './communication.cat-b-routing.module';

import { CommunicationCatBPage } from './communication.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatBPageRoutingModule
  ],
  declarations: [CommunicationCatBPage]
})
export class CommunicationCatBPageModule {}

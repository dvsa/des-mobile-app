import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatBePageRoutingModule } from './communication.cat-be-routing.module';

import { CommunicationCatBePage } from './communication.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatBePageRoutingModule,
  ],
  declarations: [CommunicationCatBePage],
})
export class CommunicationCatBePageModule {}

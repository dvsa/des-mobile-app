import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CommunicationCatHomeTestPageRoutingModule } from './communication.cat-home-test-routing.module';

import { CommunicationCatHomeTestPage } from './communication.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunicationCatHomeTestPageRoutingModule,
  ],
  declarations: [CommunicationCatHomeTestPage],
})
export class CommunicationCatHomeTestPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatHomeTestPageRoutingModule } from './office.cat-home-test-routing.module';

import { OfficeCatHomeTestPage } from './office.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatHomeTestPageRoutingModule,
  ],
  declarations: [OfficeCatHomeTestPage],
})
export class OfficeCatHomeTestPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatHomeTestPageRoutingModule } from './back-to-office.cat-home-test-routing.module';

import { BackToOfficeCatHomeTestPage } from './back-to-office.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatHomeTestPageRoutingModule,
  ],
  declarations: [BackToOfficeCatHomeTestPage],
})
export class BackToOfficeCatHomeTestPageModule {}

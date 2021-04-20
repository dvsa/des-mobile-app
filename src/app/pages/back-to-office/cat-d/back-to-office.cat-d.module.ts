import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatDPageRoutingModule } from './back-to-office.cat-d-routing.module';
import { BackToOfficeCatDPage } from './back-to-office.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatDPageRoutingModule,
  ],
  declarations: [BackToOfficeCatDPage],
})
export class BackToOfficeCatDPageModule {}

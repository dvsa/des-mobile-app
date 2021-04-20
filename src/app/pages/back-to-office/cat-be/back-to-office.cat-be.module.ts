import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatBEPageRoutingModule } from './back-to-office.cat-be-routing.module';

import { BackToOfficeCatBEPage } from './back-to-office.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatBEPageRoutingModule,
  ],
  declarations: [BackToOfficeCatBEPage],
})
export class BackToOfficeCatBEPageModule {}

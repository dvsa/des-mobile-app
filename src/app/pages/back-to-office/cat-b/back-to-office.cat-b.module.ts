import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatBPageRoutingModule } from './back-to-office.cat-b-routing.module';

import { BackToOfficeCatBPage } from './back-to-office.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatBPageRoutingModule
  ],
  declarations: [BackToOfficeCatBPage]
})
export class BackToOfficeCatBPageModule {}

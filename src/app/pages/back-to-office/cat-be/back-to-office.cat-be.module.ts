import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatBePageRoutingModule } from './back-to-office.cat-be-routing.module';

import { BackToOfficeCatBePage } from './back-to-office.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatBePageRoutingModule,
  ],
  declarations: [BackToOfficeCatBePage],
})
export class BackToOfficeCatBePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatCPageRoutingModule } from './back-to-office.cat-c-routing.module';
import { BackToOfficeCatCPage } from './back-to-office.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatCPageRoutingModule,
  ],
  declarations: [BackToOfficeCatCPage],
})
export class BackToOfficeCatCPageModule {}

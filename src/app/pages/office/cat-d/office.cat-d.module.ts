import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { OfficeCatDPageRoutingModule } from './office.cat-d-routing.module';
import { OfficeCatDPage } from './office.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatDPageRoutingModule,
  ],
  declarations: [OfficeCatDPage],
})
export class OfficeCatDPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatBEPageRoutingModule } from './office.cat-be-routing.module';

import { OfficeCatBEPage } from './office.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatBEPageRoutingModule,
  ],
  declarations: [OfficeCatBEPage],
})
export class OfficeCatBEPageModule {}

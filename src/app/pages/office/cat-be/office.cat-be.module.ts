import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatBePageRoutingModule } from './office.cat-be-routing.module';

import { OfficeCatBePage } from './office.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatBePageRoutingModule,
  ],
  declarations: [OfficeCatBePage],
})
export class OfficeCatBePageModule {}

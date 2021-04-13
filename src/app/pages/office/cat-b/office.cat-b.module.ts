import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatBPageRoutingModule } from './office.cat-b-routing.module';

import { OfficeCatBPage } from './office.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatBPageRoutingModule,
  ],
  declarations: [OfficeCatBPage],
})
export class OfficeCatBPageModule {}

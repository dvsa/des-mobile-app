import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OfficeCatCPCPageRoutingModule } from './office.cat-cpc-routing.module';

import { OfficeCatCPCPage } from './office.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OfficeCatCPCPageRoutingModule,
  ],
  declarations: [OfficeCatCPCPage],
})
export class OfficeCatCPCPageModule {}

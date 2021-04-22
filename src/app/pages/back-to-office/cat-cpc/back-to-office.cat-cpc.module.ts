import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackToOfficeCatCPCPageRoutingModule } from './back-to-office.cat-cpc-routing.module';

import { BackToOfficeCatCPCPage } from './back-to-office.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackToOfficeCatCPCPageRoutingModule,
  ],
  declarations: [BackToOfficeCatCPCPage],
})
export class BackToOfficeCatCPCPageModule {}

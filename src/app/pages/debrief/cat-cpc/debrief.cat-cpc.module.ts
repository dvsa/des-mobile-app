import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DebriefCatCPCPageRoutingModule } from './debrief.cat-cpc-routing.module';

import { DebriefCatCPCPage } from './debrief.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DebriefCatCPCPageRoutingModule,
  ],
  declarations: [DebriefCatCPCPage],
})
export class DebriefCatCPCPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Office.CatBePageRoutingModule } from './office.cat-be-routing.module';

import { Office.CatBePage } from './office.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Office.CatBePageRoutingModule
  ],
  declarations: [Office.CatBePage]
})
export class Office.CatBePageModule {}

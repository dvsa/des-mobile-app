import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Debrief.CatBePageRoutingModule } from './debrief.cat-be-routing.module';

import { Debrief.CatBePage } from './debrief.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Debrief.CatBePageRoutingModule
  ],
  declarations: [Debrief.CatBePage]
})
export class Debrief.CatBePageModule {}

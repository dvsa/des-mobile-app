import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NonPassFinalisation.CatBePageRoutingModule } from './non-pass-finalisation.cat-be-routing.module';

import { NonPassFinalisation.CatBePage } from './non-pass-finalisation.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NonPassFinalisation.CatBePageRoutingModule
  ],
  declarations: [NonPassFinalisation.CatBePage]
})
export class NonPassFinalisation.CatBePageModule {}

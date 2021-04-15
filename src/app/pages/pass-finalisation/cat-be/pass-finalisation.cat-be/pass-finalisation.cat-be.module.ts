import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PassFinalisation.CatBePageRoutingModule } from './pass-finalisation.cat-be-routing.module';

import { PassFinalisation.CatBePage } from './pass-finalisation.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisation.CatBePageRoutingModule
  ],
  declarations: [PassFinalisation.CatBePage]
})
export class PassFinalisation.CatBePageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclaration.CatBePageRoutingModule } from './health-declaration.cat-be-routing.module';

import { HealthDeclaration.CatBePage } from './health-declaration.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclaration.CatBePageRoutingModule
  ],
  declarations: [HealthDeclaration.CatBePage]
})
export class HealthDeclaration.CatBePageModule {}

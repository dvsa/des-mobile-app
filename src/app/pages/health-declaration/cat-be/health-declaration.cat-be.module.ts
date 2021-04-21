import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatBEPageRoutingModule } from './health-declaration.cat-be-routing.module';

import { HealthDeclarationCatBEPage } from './health-declaration.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatBEPageRoutingModule,
  ],
  declarations: [HealthDeclarationCatBEPage],
})
export class HealthDeclarationCatBEPageModule {}

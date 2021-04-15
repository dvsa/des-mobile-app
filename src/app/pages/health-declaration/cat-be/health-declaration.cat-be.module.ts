import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatBePageRoutingModule } from './health-declaration.cat-be-routing.module';

import { HealthDeclarationCatBePage } from './health-declaration.cat-be.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatBePageRoutingModule,
  ],
  declarations: [HealthDeclarationCatBePage],
})
export class HealthDeclarationCatBePageModule {}

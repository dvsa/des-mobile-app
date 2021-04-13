import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatBPageRoutingModule } from './health-declaration.cat-b-routing.module';

import { HealthDeclarationCatBPage } from './health-declaration.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatBPageRoutingModule
  ],
  declarations: [HealthDeclarationCatBPage]
})
export class HealthDeclarationCatBPageModule {}

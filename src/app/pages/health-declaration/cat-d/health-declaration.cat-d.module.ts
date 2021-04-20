import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatDPageRoutingModule } from './health-declaration.cat-d-routing.module';
import { HealthDeclarationCatDPage } from './health-declaration.cat-d.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatDPageRoutingModule,
  ],
  declarations: [HealthDeclarationCatDPage],
})
export class HealthDeclarationCatDPageModule {}

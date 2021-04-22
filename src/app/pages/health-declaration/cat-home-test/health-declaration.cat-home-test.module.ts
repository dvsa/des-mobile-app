import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatHomeTestPageRoutingModule } from './health-declaration.cat-home-test-routing.module';

import { HealthDeclarationCatHomeTestPage } from './health-declaration.cat-home-test.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatHomeTestPageRoutingModule,
  ],
  declarations: [HealthDeclarationCatHomeTestPage],
})
export class HealthDeclarationCatHomeTestPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatCPageRoutingModule } from './health-declaration.cat-c-routing.module';
import { HealthDeclarationCatCPage } from './health-declaration.cat-c.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatCPageRoutingModule,
  ],
  declarations: [HealthDeclarationCatCPage],
})
export class HealthDeclarationCatCPageModule {}

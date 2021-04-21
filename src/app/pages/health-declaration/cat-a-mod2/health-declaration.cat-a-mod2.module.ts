import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatAMod2PageRoutingModule } from './health-declaration.cat-a-mod2-routing.module';
import { HealthDeclarationCatAMod2Page } from './health-declaration.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatAMod2PageRoutingModule,
  ],
  declarations: [HealthDeclarationCatAMod2Page],
})
export class HealthDeclarationCatDPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatAMod1PageRoutingModule } from './health-declaration.cat-a-mod1-routing.module';

import { HealthDeclarationCatAMod1Page } from './health-declaration.cat-a-mod1.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatAMod1PageRoutingModule,
  ],
  declarations: [HealthDeclarationCatAMod1Page],
})
export class HealthDeclarationCatAMod1PageModule {}

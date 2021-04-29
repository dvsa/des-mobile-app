import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationPageRoutingModule } from './health-declaration-routing.module';

import { HealthDeclarationPage } from './health-declaration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationPageRoutingModule,
  ],
  declarations: [HealthDeclarationPage],
})
export class HealthDeclarationPageModule {}

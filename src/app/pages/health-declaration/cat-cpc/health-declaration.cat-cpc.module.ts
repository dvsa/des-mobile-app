import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HealthDeclarationCatCPCPageRoutingModule } from './health-declaration.cat-cpc-routing.module';

import { HealthDeclarationCatCPCPage } from './health-declaration.cat-cpc.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationCatCPCPageRoutingModule,
  ],
  declarations: [HealthDeclarationCatCPCPage],
})
export class HealthDeclarationCatCPCPageModule {}

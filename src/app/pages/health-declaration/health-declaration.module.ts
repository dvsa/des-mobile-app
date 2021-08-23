import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TranslateModule } from '@ngx-translate/core';
// eslint-disable-next-line max-len
import { HealthDeclarationComponentsModule } from '@pages/health-declaration/components/health-declaration.components.module';
import { HealthDeclarationPageRoutingModule } from './health-declaration-routing.module';
import { HealthDeclarationPage } from './health-declaration.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HealthDeclarationPageRoutingModule,
    TranslateModule,
    ComponentsModule,
    ReactiveFormsModule,
    HealthDeclarationComponentsModule,
  ],
  declarations: [HealthDeclarationPage],
})
export class HealthDeclarationPageModule {}

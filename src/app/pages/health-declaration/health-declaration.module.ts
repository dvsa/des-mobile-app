import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TranslateModule } from '@ngx-translate/core';
import {
  HealthDeclarationComponentsModule,
} from '@pages/health-declaration/components/health-declaration.components.module';
import { EffectsModule } from '@ngrx/effects';
import { HealthDeclarationAnalyticsEffects } from '@pages/health-declaration/health-declaration.analytics.effects';
import { HealthDeclarationEffects } from '@pages/health-declaration/health-declaration.effects';
import { HealthDeclarationPage } from './health-declaration.page';
import { HealthDeclarationPageRoutingModule } from './health-declaration-routing.module';

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
    EffectsModule.forFeature([
      HealthDeclarationAnalyticsEffects,
      HealthDeclarationEffects,
    ]),
  ],
  declarations: [HealthDeclarationPage],
})
export class HealthDeclarationPageModule {}

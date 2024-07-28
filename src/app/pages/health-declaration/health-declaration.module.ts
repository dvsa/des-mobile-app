import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import { TranslateModule } from '@ngx-translate/core';
import { HealthDeclarationComponentsModule } from '@pages/health-declaration/components/health-declaration.components.module';
import { HealthDeclarationAnalyticsEffects } from '@pages/health-declaration/health-declaration.analytics.effects';
import { HealthDeclarationEffects } from '@pages/health-declaration/health-declaration.effects';
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
    EffectsModule.forFeature([HealthDeclarationAnalyticsEffects, HealthDeclarationEffects]),
    DirectivesModule,
  ],
  declarations: [HealthDeclarationPage],
})
export class HealthDeclarationPageModule {}

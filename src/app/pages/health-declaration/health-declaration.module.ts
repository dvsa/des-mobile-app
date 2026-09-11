import {AsyncPipe, CommonModule} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { DirectivesModule } from '@directives/directives.module';
import { EffectsModule } from '@ngrx/effects';
import {TranslatePipe} from '@ngx-translate/core';
import { HealthDeclarationComponentsModule } from '@pages/health-declaration/components/health-declaration.components.module';
import { HealthDeclarationAnalyticsEffects } from '@pages/health-declaration/health-declaration.analytics.effects';
import { HealthDeclarationEffects } from '@pages/health-declaration/health-declaration.effects';
import { HealthDeclarationPageRoutingModule } from './health-declaration-routing.module';
import { HealthDeclarationPage } from './health-declaration.page';
import {IonCol, IonContent, IonHeader, IonRow, IonText, IonToolbar} from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AsyncPipe,
    HealthDeclarationPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    HealthDeclarationComponentsModule,
    EffectsModule.forFeature([HealthDeclarationAnalyticsEffects, HealthDeclarationEffects]),
    DirectivesModule,
    TestFlowHeaderComponent,
    TranslatePipe,
    IonContent,
    IonToolbar,
    IonHeader,
    IonCol,
    IonText,
    IonRow,
  ],
  declarations: [HealthDeclarationPage],
})
export class HealthDeclarationPageModule {}

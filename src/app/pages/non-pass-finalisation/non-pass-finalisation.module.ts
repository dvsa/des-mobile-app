import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import {
  NonPassFinalisationAnalyticsEffects,
} from '@pages/non-pass-finalisation/non-pass-finalisation.analytics.effects';
import { EffectsModule } from '@ngrx/effects';
import { TestResultProvider } from '@providers/test-result/test-result';
import {
  PassFinalisationComponentsModule,
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { NonPassFinalisationPageRoutingModule } from './non-pass-finalisation-routing.module';
import { NonPassFinalisationPage } from './non-pass-finalisation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NonPassFinalisationPageRoutingModule,
    EffectsModule.forFeature([NonPassFinalisationAnalyticsEffects]),
    ComponentsModule,
    TestFinalisationComponentsModule,
    ReactiveFormsModule,
    PassFinalisationComponentsModule,
  ],
  providers: [
    OutcomeBehaviourMapProvider,
    ActivityCodeFinalisationProvider,
    TestResultProvider,
  ],
  declarations: [
    NonPassFinalisationPage,
  ],
})
export class NonPassFinalisationPageModule {
}

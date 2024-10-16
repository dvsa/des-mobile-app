import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { NonPassFinalisationAnalyticsEffects } from '@pages/non-pass-finalisation/non-pass-finalisation.analytics.effects';
import { PassFinalisationCatADI3ComponentsModule } from '@pages/pass-finalisation/cat-adi-part3/components/pass-finalisation.cat-adi3.components.module';
import { ActivityCodeFinalisationProvider } from '@providers/activity-code-finalisation/activity-code-finalisation';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { TestResultProvider } from '@providers/test-result/test-result';
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
    PassFinalisationCatADI3ComponentsModule,
  ],
  providers: [OutcomeBehaviourMapProvider, ActivityCodeFinalisationProvider, TestResultProvider],
  declarations: [NonPassFinalisationPage],
})
export class NonPassFinalisationPageModule {}

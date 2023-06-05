import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { PassFinalisationPage } from '@pages/pass-finalisation/pass-finalisation.page';
import { PassFinalisationPageRoutingModule } from '@pages/pass-finalisation/pass-finalisation-routing.module';
import {
  PassFinalisationComponentsModule,
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';

@NgModule({
  declarations: [PassFinalisationPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      PassFinalisationAnalyticsEffects,
    ]),
  ],
  providers: [
    OutcomeBehaviourMapProvider,
    PassCertificateValidationProvider,
  ],
})
export class PassFinalisationPageModule {
}

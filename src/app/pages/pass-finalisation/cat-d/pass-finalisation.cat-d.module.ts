import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import {
  PassFinalisationComponentsModule,
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatDPage } from './pass-finalisation.cat-d.page';
import { PassFinalisationCatDPageRoutingModule } from './pass-finalisation.cat-d-routing.module';

@NgModule({
  declarations: [PassFinalisationCatDPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatDPageRoutingModule,
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
export class PassFinalisationCatDPageModule {}

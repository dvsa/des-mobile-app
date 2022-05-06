import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import {
  PassFinalisationCatAMod1ComponentsModule,
} from '@pages/pass-finalisation/cat-a-mod1/components/pass-finalisation.cat-a-mod1.components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import {
  PassFinalisationComponentsModule,
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { PassFinalisationCatAMod1Page } from './pass-finalisation.cat-a-mod1.page';
import { PassFinalisationCatAMod1PageRoutingModule } from './pass-finalisation.cat-a-mod1-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatAMod1PageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    TestFinalisationComponentsModule,
    PassFinalisationCatAMod1ComponentsModule,
    EffectsModule.forFeature([
      PassFinalisationAnalyticsEffects,
    ]),
    PassFinalisationComponentsModule,
  ],
  declarations: [PassFinalisationCatAMod1Page],
  providers: [
    OutcomeBehaviourMapProvider,
    PassCertificateValidationProvider,
  ],
})
export class PassFinalisationCatAMod1PageModule {}

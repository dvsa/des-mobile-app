import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import {
  PassFinalisationComponentsModule,
} from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatAMod2PageRoutingModule } from './pass-finalisation.cat-a-mod2-routing.module';
import { PassFinalisationCatAMod2Page } from './pass-finalisation.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatAMod2PageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    EffectsModule.forFeature([
      PassFinalisationAnalyticsEffects,
    ]),
  ],
  declarations: [PassFinalisationCatAMod2Page],
  providers: [
    OutcomeBehaviourMapProvider,
    PassCertificateValidationProvider,
  ],
})
export class PassFinalisationCatAMod2PageModule {}

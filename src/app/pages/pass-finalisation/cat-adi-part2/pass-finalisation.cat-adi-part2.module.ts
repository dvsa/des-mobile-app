import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatADIPart2PageRoutingModule } from './pass-finalisation.cat-adi-part2-routing.module';

import { PassFinalisationCatADI2Page } from './pass-finalisation.cat-adi-part2.page';

@NgModule({
  declarations: [PassFinalisationCatADI2Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PassFinalisationCatADIPart2PageRoutingModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
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
export class PassFinalisationCatADIPart2PageModule {}

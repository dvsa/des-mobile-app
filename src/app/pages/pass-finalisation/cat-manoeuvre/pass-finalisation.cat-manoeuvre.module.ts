import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationCatManoeuvrePage } from '@pages/pass-finalisation/cat-manoeuvre/pass-finalisation.cat-manoeuvre.page';
import { PassFinalisationCatManoeuvrePageRoutingModule } from '@pages/pass-finalisation/cat-manoeuvre/pass-finalisation.cat-manoeuvre.routing-module';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationComponentsModule } from '../components/pass-finalisation-components.module';

@NgModule({
  declarations: [PassFinalisationCatManoeuvrePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatManoeuvrePageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFinalisationComponentsModule,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatManoeuvrePageModule {}

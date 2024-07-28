import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationComponentsModule } from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatCPCPageRoutingModule } from './pass-finalisation.cat-cpc-routing.module';
import { PassFinalisationCatCPCPage } from './pass-finalisation.cat-cpc.page';

@NgModule({
  declarations: [PassFinalisationCatCPCPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    PassFinalisationCatCPCPageRoutingModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatCPCPageModule {}

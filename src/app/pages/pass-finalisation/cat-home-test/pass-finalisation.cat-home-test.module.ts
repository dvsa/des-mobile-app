import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import {
  PassFinalisationCatHomeTestPageRoutingModule,
} from '@pages/pass-finalisation/cat-home-test/pass-finalisation.cat-home-test-routing.module';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatHomeTestPage } from './pass-finalisation.cat-home-test.page';
import { PassFinalisationAnalyticsEffects } from '../pass-finalisation.analytics.effects';
import { PassFinalisationComponentsModule } from '../components/pass-finalisation-components.module';

@NgModule({
  declarations: [
    PassFinalisationCatHomeTestPage,
  ],
  imports: [
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatHomeTestPageRoutingModule,
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
  ],
  providers: [
    OutcomeBehaviourMapProvider,
    PassCertificateValidationProvider,
  ],
})
export class PassFinalisationCatHomeTestPageModule {}

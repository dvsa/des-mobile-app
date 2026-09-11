import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatADIPart2PageRoutingModule } from './pass-finalisation.cat-adi-part2-routing.module';

import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { PassFinalisationCatADI2Page } from './pass-finalisation.cat-adi-part2.page';

@NgModule({
  declarations: [PassFinalisationCatADI2Page],
  imports: [
    CommonModule,
    FormsModule,

    PassFinalisationCatADIPart2PageRoutingModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonFooter,
    IonToolbar,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    IonGrid,
    IonContent,
    IonHeader,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatADIPart2PageModule {}

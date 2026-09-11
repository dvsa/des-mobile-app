import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { PassFinalisationComponentsModule } from '@pages/pass-finalisation/components/pass-finalisation-components.module';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationCatCPageRoutingModule } from './pass-finalisation.cat-c-routing.module';
import { PassFinalisationCatCPage } from './pass-finalisation.cat-c.page';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar
} from "@ionic/angular";

@NgModule({
  declarations: [PassFinalisationCatCPage],
  imports: [
    CommonModule,
    FormsModule,

    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatCPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonCol,
    IonButton,
    IonText,
    IonToolbar,
    IonRow,
    IonFooter,
    IonGrid,
    IonContent,
    IonHeader,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatCPageModule {}

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
import { PassFinalisationCatDPageRoutingModule } from './pass-finalisation.cat-d-routing.module';
import { PassFinalisationCatDPage } from './pass-finalisation.cat-d.page';
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
  declarations: [PassFinalisationCatDPage],
  imports: [
    CommonModule,
    FormsModule,

    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatDPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonText,
    IonButton,
    IonCol,
    IonRow,
    IonToolbar,
    IonFooter,
    IonGrid,
    IonContent,
    IonHeader,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatDPageModule {}

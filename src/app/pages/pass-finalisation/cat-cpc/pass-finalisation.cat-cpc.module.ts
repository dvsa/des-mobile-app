import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
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

    ComponentsModule,
    PassFinalisationCatCPCPageRoutingModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonFooter,
    IonToolbar,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    IonHeader,
    IonContent,
    IonGrid,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatCPCPageModule {}

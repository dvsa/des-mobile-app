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

    ComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatManoeuvrePageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFinalisationComponentsModule,
    TestFlowHeaderComponent,
    IonToolbar,
    IonFooter,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonGrid,
    IonContent,
    IonHeader,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
})
export class PassFinalisationCatManoeuvrePageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DangerBannerComponent } from '@components/common/danger-banner/danger-banner';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { TestFinalisationComponentsModule } from '@components/test-finalisation/test-finalisation-components.module';
import { EffectsModule } from '@ngrx/effects';
import { PassFinalisationCatBPageRoutingModule } from '@pages/pass-finalisation/cat-b/pass-finalisation.cat-b-routing.module';
import { PassFinalisationAnalyticsEffects } from '@pages/pass-finalisation/pass-finalisation.analytics.effects';
import { OutcomeBehaviourMapProvider } from '@providers/outcome-behaviour-map/outcome-behaviour-map';
import { PassCertificateValidationProvider } from '@providers/pass-certificate-validation/pass-certificate-validation';
import { PassFinalisationComponentsModule } from '../components/pass-finalisation-components.module';
import { PassFinalisationCatBPage } from './pass-finalisation.cat-b.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ComponentsModule,
    TestFinalisationComponentsModule,
    PassFinalisationComponentsModule,
    PassFinalisationCatBPageRoutingModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([PassFinalisationAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonCol,
    IonIcon,
    IonRow,
    IonGrid,
    IonToolbar,
    IonHeader,
    IonContent,
    IonInput,
    IonFooter,
    IonText,
    IonButton,
  ],
  providers: [OutcomeBehaviourMapProvider, PassCertificateValidationProvider],
  declarations: [PassFinalisationCatBPage, DangerBannerComponent],
})
export class PassFinalisationCatBPageModule {}

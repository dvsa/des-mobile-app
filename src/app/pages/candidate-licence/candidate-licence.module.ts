import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ComponentsModule } from '@components/common/common-components.module';
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
import { EffectsModule } from '@ngrx/effects';
import { CandidateDetailsComponentsModule } from '@pages/candidate-details/components/candidate-details-components.module';
import { CandidateLicenceAnalyticsEffects } from '@pages/candidate-licence/candidate-licence.analytics.effects';
import { CandidateLicenceEffects } from '@pages/candidate-licence/candidate-licence.effects';
import { CandidateLicenceComponentsModule } from '@pages/candidate-licence/components/candidate-licence.components.module';
import { OfficeComponentsModule } from '@pages/office/components/office.components.module';
import { CandidateLicencePageRoutingModule } from './candidate-licence-routing.module';
import { CandidateLicencePage } from './candidate-licence.page';

@NgModule({
  declarations: [CandidateLicencePage],
  imports: [
    CommonModule,
    FormsModule,

    CandidateLicencePageRoutingModule,
    CandidateLicenceComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    OfficeComponentsModule,
    EffectsModule.forFeature([CandidateLicenceEffects, CandidateLicenceAnalyticsEffects]),
    CandidateDetailsComponentsModule,
    TestFlowHeaderComponent,
    IonButton,
    IonText,
    IonCol,
    IonRow,
    IonToolbar,
    IonFooter,
    IonGrid,
    IonContent,
    IonHeader,
  ],
})
export class CandidateLicencePageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { CandidateDetailsComponentsModule } from '@pages/candidate-details/components/candidate-details-components.module';
import { ActivityCodeCard } from '@pages/view-test-result/components/activity-code-card/activity-code-card';
import { ViewTestResultComponentsModule } from '@pages/view-test-result/components/view-test-result.components.module';
import { ViewTestResultAnalyticsEffects } from '@pages/view-test-result/view-test-result.analytics.effects';
import { ViewTestResultPage } from '@pages/view-test-result/view-test-result.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    ComponentsModule,
    ViewTestResultComponentsModule,
    EffectsModule.forFeature([ViewTestResultAnalyticsEffects]),
    CandidateDetailsComponentsModule,
    IonLabel,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonContent,
    IonGrid,
    IonCardContent,
    IonCardHeader,
    IonCard,
  ],
  declarations: [ViewTestResultPage, ActivityCodeCard],
})
export class ViewTestResultPageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { EffectsModule } from '@ngrx/effects';
import { CandidateDetailsAnalyticsEffects } from '@pages/candidate-details/candidate-details.analytics.effects';
import { CandidateDetailsComponentsModule } from '@pages/candidate-details/components/candidate-details-components.module';
import { CandidateDetailsPage } from './candidate-details.page';
import {
  IonButton,
  IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel, IonRow,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    ComponentsModule,
    CandidateDetailsComponentsModule,
    EffectsModule.forFeature([CandidateDetailsAnalyticsEffects]),
    IonToolbar,
    IonHeader,
    IonTitle,
    IonButtons,
    IonButton,
    IonIcon,
    IonLabel,
    IonContent,
    IonGrid,
    IonRow,
    IonCardHeader,
    IonCard,
    IonCardContent,
    IonCol,
  ],
  declarations: [CandidateDetailsPage],
})
export class CandidateDetailsPageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { RekeyUploadOutcomeAnalyticsEffects } from '@pages/rekey-upload-outcome/rekey-upload-outcome.analytics.effects';
import { RekeyUploadOutcomePage } from './rekey-upload-outcome.page';
import { RekeyUploadOutcomePageRoutingModule } from './rekey-upload-outcome.routing.module';

@NgModule({
  declarations: [RekeyUploadOutcomePage],
  imports: [
    CommonModule,
    FormsModule,

    RekeyUploadOutcomePageRoutingModule,
    EffectsModule.forFeature([RekeyUploadOutcomeAnalyticsEffects]),
    IonText,
    IonButton,
    IonCol,
    IonRow,
    IonFooter,
    IonIcon,
    IonGrid,
    IonContent,
    IonTitle,
    IonToolbar,
    IonHeader,
  ],
})
export class RekeyUploadOutcomePageModule {}

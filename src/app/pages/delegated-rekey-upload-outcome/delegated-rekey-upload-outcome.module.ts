import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { DelegatedRekeyUploadOutcomePageRoutingModule } from '@pages/delegated-rekey-upload-outcome/delegated-rekey-upload-outcome.routing.module';
import { DelegatedRekeyUploadOutcomePage } from './delegated-rekey-upload-outcome';

@NgModule({
  imports: [
    ComponentsModule,
    CommonModule,
    DelegatedRekeyUploadOutcomePageRoutingModule,
    IonButton,
    IonCol,
    IonRow,
    IonFooter,
    IonText,
    IonContent,
    IonGrid,
    IonSpinner,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonIcon,
    DelegatedRekeyUploadOutcomePage,
  ],
})
export class DelegatedRekeyUploadOutcomePageModule {}

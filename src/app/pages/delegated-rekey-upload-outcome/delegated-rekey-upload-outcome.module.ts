import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ComponentsModule } from '@components/common/common-components.module';

import { DelegatedRekeyUploadOutcomePageRoutingModule } from '@pages/delegated-rekey-upload-outcome/delegated-rekey-upload-outcome.routing.module';
import { DelegatedRekeyUploadOutcomePage } from './delegated-rekey-upload-outcome';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid, IonHeader, IonIcon,
  IonRow,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/angular";

@NgModule({
  declarations: [DelegatedRekeyUploadOutcomePage],
  imports: [ComponentsModule, CommonModule, DelegatedRekeyUploadOutcomePageRoutingModule, IonButton, IonCol, IonRow, IonFooter, IonText, IonContent, IonGrid, IonSpinner, IonTitle, IonToolbar, IonHeader, IonIcon],
})
export class DelegatedRekeyUploadOutcomePageModule {}

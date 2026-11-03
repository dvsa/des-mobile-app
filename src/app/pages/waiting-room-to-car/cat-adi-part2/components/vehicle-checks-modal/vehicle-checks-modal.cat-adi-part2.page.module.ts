import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { VehicleChecksCatADIPart2Modal } from './vehicle-checks-modal.cat-adi-part2.page';

@NgModule({
  imports: [
    WaitingRoomToCarComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonFooter,
    IonRow,
    IonCol,
    IonButton,
    IonText,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonIcon,
    IonLabel,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    VehicleChecksCatADIPart2Modal,
  ],
})
export class VehicleChecksModalCatADIPart2Module {}

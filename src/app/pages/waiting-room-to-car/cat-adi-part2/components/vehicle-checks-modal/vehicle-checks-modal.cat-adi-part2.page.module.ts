import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

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
import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { VehicleChecksModalAnalyticsEffects } from './vehicle-checks-modal.cat-adi-part2.analytics.effects';
import { VehicleChecksCatADIPart2Modal } from './vehicle-checks-modal.cat-adi-part2.page';

@NgModule({
  declarations: [VehicleChecksCatADIPart2Modal],
  imports: [
    EffectsModule.forFeature([VehicleChecksModalAnalyticsEffects]),
    ComponentsModule,
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
  ],
})
export class VehicleChecksModalCatADIPart2Module {}

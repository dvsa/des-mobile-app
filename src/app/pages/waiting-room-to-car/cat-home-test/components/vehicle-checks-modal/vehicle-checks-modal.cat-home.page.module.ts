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
import { EffectsModule } from '@ngrx/effects';
import { VehicleChecksCatHomeTestModal } from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatHomeTestAnalyticsEffects } from './vehicle-checks-modal.cat-home-test.analytics.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([VehicleChecksModalCatHomeTestAnalyticsEffects]),
    WaitingRoomToCarComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonFooter,
    IonRow,
    IonCol,
    IonText,
    IonButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonTitle,
    IonIcon,
    IonLabel,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    VehicleChecksCatHomeTestModal,
  ],
})
export class VehicleChecksModalCatHomeModule {}

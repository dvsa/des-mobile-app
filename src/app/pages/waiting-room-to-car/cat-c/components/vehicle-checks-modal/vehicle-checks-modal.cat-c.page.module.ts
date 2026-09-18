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
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatCAnalyticsEffects } from './vehicle-checks-modal.cat-c.analytics.effects';
import { VehicleChecksCatCModal } from './vehicle-checks-modal.cat-c.page';

@NgModule({
  declarations: [VehicleChecksCatCModal],
  imports: [
    EffectsModule.forFeature([VehicleChecksModalCatCAnalyticsEffects]),
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
    IonCardTitle,
    IonCardHeader,
    IonCardContent,
  ],
})
export class VehicleChecksModalCatCModule {}

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
import { VehicleChecksQuestionCatAMod2Module } from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-question/vehicle-checks-question.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatAMod2AnalyticsEffects } from './vehicle-checks-modal.cat-a-mod2.analytics.effects';
import { VehicleChecksCatAMod2Modal } from './vehicle-checks-modal.cat-a-mod2.page';

@NgModule({
  declarations: [VehicleChecksCatAMod2Modal],
  imports: [
    EffectsModule.forFeature([VehicleChecksModalCatAMod2AnalyticsEffects]),

    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    WaitingRoomToCarComponentsModule,
    VehicleChecksQuestionCatAMod2Module,
    IonLabel,
    IonIcon,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonCardTitle,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonContent,
    IonText,
    IonCol,
    IonRow,
    IonFooter,
  ],
})
export class VehicleChecksModalCatAMod2Module {}

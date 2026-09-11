import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { EffectsModule } from '@ngrx/effects';
import { SafetyQuestionComponent } from '@pages/waiting-room-to-car/cat-d/components/safety-question/safety-question';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatDAnalyticsEffects } from './vehicle-checks-modal.cat-d.analytics.effects';
import { VehicleChecksCatDModal } from './vehicle-checks-modal.cat-d.page';
import {
  IonButton, IonButtons, IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol, IonContent,
  IonFooter, IonHeader, IonIcon, IonLabel,
  IonRow,
  IonText, IonTitle, IonToolbar
} from '@ionic/angular';

@NgModule({
  declarations: [VehicleChecksCatDModal, SafetyQuestionComponent],
  imports: [
    EffectsModule.forFeature([VehicleChecksModalCatDAnalyticsEffects]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonText,
    IonButton,
    IonCol,
    IonRow,
    IonFooter,
    IonCardContent,
    IonCardTitle,
    IonCardHeader,
    IonCard,
    IonTitle,
    IonContent,
    IonLabel,
    IonIcon,
    IonButtons,
    IonToolbar,
    IonHeader,
  ],
})
export class VehicleChecksModalCatDModule {}

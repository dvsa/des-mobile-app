import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarCatADIPart2ComponentsModule } from '@pages/waiting-room-to-car/cat-adi-part2/components/waiting-room-to-car.cat-adi-part2.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatADIPart2PageRoutingModule } from './waiting-room-to-car.cat-adi-part2-routing.module';

import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar,
} from '@ionic/angular';
import { SafetyRecallComponent } from '@pages/waiting-room-to-car/components/safety-recall/safety-recall';
import { WaitingRoomToCarCatADIPart2Page } from './waiting-room-to-car.cat-adi-part2.page';

@NgModule({
  declarations: [WaitingRoomToCarCatADIPart2Page],
  imports: [
    CommonModule,
    FormsModule,

    WaitingRoomToCarCatADIPart2ComponentsModule,
    WaitingRoomToCarCatADIPart2PageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
    TestFlowHeaderComponent,
    SafetyRecallComponent,
    IonButton,
    IonCol,
    IonText,
    IonRow,
    IonFooter,
    IonContent,
    IonGrid,
    IonToolbar,
    IonHeader,
  ],
})
export class WaitingRoomToCarCatADIPart2PageModule {}

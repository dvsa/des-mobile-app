import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { WaitingRoomToCarCatBComponentsModule } from '@pages/waiting-room-to-car/cat-b/components/waiting-room-to-car.cat-b.components.module';
import { SafetyRecallComponent } from '@pages/waiting-room-to-car/components/safety-recall/safety-recall';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatBPageRoutingModule } from './waiting-room-to-car.cat-b-routing.module';
import { WaitingRoomToCarCatBPage } from './waiting-room-to-car.cat-b.page';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonRow,
  IonText,
  IonToolbar
} from '@ionic/angular';

@NgModule({
  declarations: [WaitingRoomToCarCatBPage],
  imports: [
    CommonModule,
    FormsModule,

    WaitingRoomToCarCatBPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    WaitingRoomToCarCatBComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
    TestFlowHeaderComponent,
    SafetyRecallComponent,
    IonText,
    IonButton,
    IonCol,
    IonRow,
    IonFooter,
    IonGrid,
    IonContent,
    IonToolbar,
    IonHeader,
  ],
})
export class WaitingRoomToCarCatBPageModule {}

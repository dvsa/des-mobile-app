import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { WaitingRoomToCarCatCComponentsModule } from '@pages/waiting-room-to-car/cat-c/components/waiting-room-to-car.cat-c.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatCPageRoutingModule } from './waiting-room-to-car.cat-c-routing.module';
import { WaitingRoomToCarCatCPage } from './waiting-room-to-car.cat-c.page';
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
  declarations: [WaitingRoomToCarCatCPage],
  imports: [
    CommonModule,
    FormsModule,

    WaitingRoomToCarCatCPageRoutingModule,
    WaitingRoomToCarCatCComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonToolbar,
    IonHeader,
    IonContent,
    IonRow,
    IonGrid,
    IonCol,
    IonFooter,
    IonButton,
    IonText,
  ],
})
export class WaitingRoomToCarCatCPageModule {}

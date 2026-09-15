import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { WaitingRoomToCarCatManoeuvreComponentsModule } from '@pages/waiting-room-to-car/cat-manoeuvre/components/waiting-room-to-car.cat-manoeuvre.components.module';
import { WaitingRoomToCarCatManoeuvrePage } from '@pages/waiting-room-to-car/cat-manoeuvre/waiting-room-to-car.cat-manoeuvre.page';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatManoeuvrePageRoutingModule } from './waiting-room-to-car.cat-manoeuvre.routing-module';

@NgModule({
  declarations: [WaitingRoomToCarCatManoeuvrePage],
  imports: [
    CommonModule,
    FormsModule,
    WaitingRoomToCarComponentsModule,
    WaitingRoomToCarCatManoeuvreComponentsModule,
    WaitingRoomToCarCatManoeuvrePageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonToolbar,
    IonHeader,
    IonText,
    IonButton,
    IonCol,
    IonRow,
    IonFooter,
    IonGrid,
    IonContent,
  ],
})
export class WaitingRoomToCarCatManoeuvrePageModule {}

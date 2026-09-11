import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatAMod1PageRoutingModule } from './waiting-room-to-car.cat-a-mod1-routing.module';

import { TestFlowHeaderComponent } from '@components/common/test-flow-header/test-flow-header.component';
import { WaitingRoomToCarCatAMod1Page } from './waiting-room-to-car.cat-a-mod1.page';
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
  declarations: [WaitingRoomToCarCatAMod1Page],
  imports: [
    CommonModule,
    FormsModule,
    WaitingRoomToCarCatAMod1PageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
    TestFlowHeaderComponent,
    IonButton,
    IonText,
    IonCol,
    IonRow,
    IonFooter,
    IonGrid,
    IonContent,
    IonToolbar,
    IonHeader,
  ],
})
export class WaitingRoomToCarCatAMod1PageModule {}

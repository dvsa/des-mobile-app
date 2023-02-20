import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';

import { WaitingRoomToCarEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.effects';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarCatHomeComponentsModule,
} from '@pages/waiting-room-to-car/cat-home-test/components/waiting-room-to-car-.cat-home.components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatHomeTestPageRoutingModule } from './waiting-room-to-car.cat-home-test-routing.module';

import { WaitingRoomToCarCatHomeTestPage } from './waiting-room-to-car.cat-home-test.page';

@NgModule({
  declarations: [WaitingRoomToCarCatHomeTestPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatHomeTestPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarCatHomeComponentsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarEffects,
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
})
export class WaitingRoomToCarCatHomeTestPageModule {}

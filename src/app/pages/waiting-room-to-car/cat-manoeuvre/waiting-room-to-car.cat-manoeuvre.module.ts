import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { WaitingRoomToCarEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.effects';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import {
  WaitingRoomToCarCatManoeuvrePage,
} from '@pages/waiting-room-to-car/cat-manoeuvre/waiting-room-to-car.cat-manoeuvre.page';
import {
  WaitingRoomToCarCatManoeuvreComponentsModule,
} from '@pages/waiting-room-to-car/cat-manoeuvre/components/waiting-room-to-car.cat-manoeuvre.components.module';
import { WaitingRoomToCarCatManoeuvrePageRoutingModule } from './waiting-room-to-car.cat-manoeuvre.routing-module';

@NgModule({
  declarations: [WaitingRoomToCarCatManoeuvrePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarComponentsModule,
    WaitingRoomToCarCatManoeuvreComponentsModule,
    WaitingRoomToCarCatManoeuvrePageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarEffects,
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
})
export class WaitingRoomToCarCatManoeuvrePageModule {}

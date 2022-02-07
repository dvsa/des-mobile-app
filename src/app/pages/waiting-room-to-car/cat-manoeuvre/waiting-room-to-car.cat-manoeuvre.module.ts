import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import {
  WaitingRoomToCarCatManoeuvrePage,
} from '@pages/waiting-room-to-car/cat-manoeuvre/waiting-room-to-car.cat-manoeuvre.page';
import { WaitingRoomToCarCatManoeuvrePageRoutingModule } from './waiting-room-to-car.cat-manoeuvre.routing-module';

@NgModule({
  declarations: [WaitingRoomToCarCatManoeuvrePage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarComponentsModule,
    WaitingRoomToCarCatManoeuvrePageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
})
export class WaitingRoomToCarCatManoeuvrePageModule {}

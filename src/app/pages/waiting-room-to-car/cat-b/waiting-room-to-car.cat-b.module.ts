import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import {
  WaitingRoomToCarCatBComponentsModule,
} from '@pages/waiting-room-to-car/cat-b/components/waiting-room-to-car.cat-b.components.module';
import { WaitingRoomToCarEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.effects';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatBPage } from './waiting-room-to-car.cat-b.page';
import { WaitingRoomToCarCatBPageRoutingModule } from './waiting-room-to-car.cat-b-routing.module';

@NgModule({
  declarations: [WaitingRoomToCarCatBPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatBPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    WaitingRoomToCarCatBComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarEffects,
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
})
export class WaitingRoomToCarCatBPageModule {}

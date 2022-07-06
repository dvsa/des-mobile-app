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
  WaitingRoomToCarCatADIPart2ComponentsModule,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/waiting-room-to-car.cat-adi-part2.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import {
  WaitingRoomToCarCatADIPart3ComponentsModule,
} from '@pages/waiting-room-to-car/cat-adi-part3/components/waiting-room-to-car.cat-adi-part3.components.module';
import { WaitingRoomToCarCatADIPart3PageRoutingModule } from './waiting-room-to-car.cat-adi-part3-routing.module';

import { WaitingRoomToCarCatADIPart3Page } from './waiting-room-to-car.cat-adi-part3.page';

@NgModule({
  declarations: [WaitingRoomToCarCatADIPart3Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatADIPart2ComponentsModule,
    WaitingRoomToCarCatADIPart3ComponentsModule,
    WaitingRoomToCarCatADIPart3PageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
})
export class WaitingRoomToCarCatADIPart3PageModule {}

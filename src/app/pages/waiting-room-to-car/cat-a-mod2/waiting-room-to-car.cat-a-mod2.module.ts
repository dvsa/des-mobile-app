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
  WaitingRoomToCarCatAMod2ComponentsModule,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/waiting-room-to-car.cat-a-mod2.components.module';
import { WaitingRoomToCarCatAMod2PageRoutingModule } from './waiting-room-to-car.cat-a-mod2-routing.module';
import { WaitingRoomToCarCatAMod2Page } from './waiting-room-to-car.cat-a-mod2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatAMod2PageRoutingModule,
    WaitingRoomToCarCatAMod2ComponentsModule,
    ReactiveFormsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
  declarations: [WaitingRoomToCarCatAMod2Page],
})
export class WaitingRoomToCarCatAMod2PageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import {
  VehicleChecksModalCatAMod2Module,
} from
  '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page.module';
import {
  WaitingRoomToCarCatAMod2ComponentsModule,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/waiting-room-to-car.cat-a-mod2.components.module';
import { WaitingRoomToCarEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.effects';
import { WaitingRoomToCarCatAMod2PageRoutingModule } from './waiting-room-to-car.cat-a-mod2-routing.module';
import { WaitingRoomToCarCatAMod2Page } from './waiting-room-to-car.cat-a-mod2.page';

@NgModule({
  declarations: [WaitingRoomToCarCatAMod2Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatAMod2PageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarEffects,
      WaitingRoomToCarAnalyticsEffects,
    ]),
    VehicleChecksModalCatAMod2Module,
    WaitingRoomToCarCatAMod2ComponentsModule,
  ],
})
export class WaitingRoomToCarCatAMod2PageModule {}

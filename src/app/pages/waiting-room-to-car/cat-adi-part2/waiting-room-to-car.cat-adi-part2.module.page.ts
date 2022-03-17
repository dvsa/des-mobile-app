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
  WaitingRoomToCarCatADI2PageRoutingModule,
} from '@pages/waiting-room-to-car/cat-adi-part2/waiting-room-to-car.cat-adi-part2-routing.module';
import {
  WaitingRoomToCarCatADIPart2ComponentsModule,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/waiting-room-to-car.cat-adi-part2.components.module';
import { VehicleChecksModalCatADIPart2Module } from
  '@pages/waiting-room-to-car/cat-adi-part2/components/vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.module';
import { WaitingRoomToCarCatADI2Page } from './waiting-room-to-car.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleChecksModalCatADIPart2Module,
    WaitingRoomToCarCatADI2PageRoutingModule,
    WaitingRoomToCarCatADIPart2ComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
  declarations: [WaitingRoomToCarCatADI2Page],
})

export class WaitingRoomToCarCatADI2PageModule {}

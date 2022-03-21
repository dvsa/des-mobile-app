import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import {
  WaitingRoomToCarCatADIPart2ComponentsModule,
} from '@pages/waiting-room-to-car/cat-adi-part2/components/waiting-room-to-car.cat-adi-part2.components.module';
import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatAdiPart2Page } from '@pages/waiting-room-to-car/cat-adi-part2/waiting-room-to-car.cat-adi-part2.page';
import { WaitingRoomToCarCatADIPart2PageRoutingModule } from './waiting-room-to-car.cat-adi-part2-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatADIPart2PageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    WaitingRoomToCarCatADIPart2ComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
  declarations: [WaitingRoomToCarCatAdiPart2Page],
})


export class WaitingRoomToCarCatADIPart2PageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.effects';
import { WaitingRoomToCarCatAMod1PageRoutingModule } from './waiting-room-to-car.cat-a-mod1-routing.module';

import { WaitingRoomToCarCatAMod1Page } from './waiting-room-to-car.cat-a-mod1.page';

@NgModule({
  declarations: [WaitingRoomToCarCatAMod1Page],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatAMod1PageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarEffects, WaitingRoomToCarAnalyticsEffects]),
  ],
})
export class WaitingRoomToCarCatAMod1PageModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarCatDComponentsModule } from '@pages/waiting-room-to-car/cat-d/components/waiting-room-to-car.cat-d.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatDPageRoutingModule } from './waiting-room-to-car.cat-d-routing.module';
import { WaitingRoomToCarCatDPage } from './waiting-room-to-car.cat-d.page';

@NgModule({
  declarations: [WaitingRoomToCarCatDPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatDPageRoutingModule,
    WaitingRoomToCarCatDComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
  ],
})
export class WaitingRoomToCarCatDPageModule {}

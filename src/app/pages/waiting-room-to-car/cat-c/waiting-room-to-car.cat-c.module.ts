import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarCatCComponentsModule } from '@pages/waiting-room-to-car/cat-c/components/waiting-room-to-car.cat-c.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatCPageRoutingModule } from './waiting-room-to-car.cat-c-routing.module';
import { WaitingRoomToCarCatCPage } from './waiting-room-to-car.cat-c.page';

@NgModule({
  declarations: [WaitingRoomToCarCatCPage],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WaitingRoomToCarCatCPageRoutingModule,
    WaitingRoomToCarCatCComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
  ],
})
export class WaitingRoomToCarCatCPageModule {}

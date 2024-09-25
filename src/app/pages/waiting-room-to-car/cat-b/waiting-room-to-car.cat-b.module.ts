import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';

import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarCatBComponentsModule } from '@pages/waiting-room-to-car/cat-b/components/waiting-room-to-car.cat-b.components.module';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '@pages/waiting-room-to-car/waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatBPageRoutingModule } from './waiting-room-to-car.cat-b-routing.module';
import { WaitingRoomToCarCatBPage } from './waiting-room-to-car.cat-b.page';

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
    EffectsModule.forFeature([WaitingRoomToCarAnalyticsEffects]),
  ],
})
export class WaitingRoomToCarCatBPageModule {}

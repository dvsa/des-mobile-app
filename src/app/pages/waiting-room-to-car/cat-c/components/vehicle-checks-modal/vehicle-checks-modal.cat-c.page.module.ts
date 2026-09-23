import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatCAnalyticsEffects } from './vehicle-checks-modal.cat-c.analytics.effects';
import { VehicleChecksCatCModal } from './vehicle-checks-modal.cat-c.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [VehicleChecksCatCModal],
  imports: [
    IonicComponentsModule,
    EffectsModule.forFeature([VehicleChecksModalCatCAnalyticsEffects]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatCModule {}

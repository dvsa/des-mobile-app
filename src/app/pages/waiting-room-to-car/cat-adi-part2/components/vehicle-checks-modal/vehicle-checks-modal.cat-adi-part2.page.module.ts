import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import { VehicleChecksModalAnalyticsEffects } from './vehicle-checks-modal.cat-adi-part2.analytics.effects';
import { VehicleChecksCatADIPart2Modal } from './vehicle-checks-modal.cat-adi-part2.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [VehicleChecksCatADIPart2Modal],
  imports: [
    IonicComponentsModule,
    EffectsModule.forFeature([VehicleChecksModalAnalyticsEffects]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatADIPart2Module {}

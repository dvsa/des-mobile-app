import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  VehicleChecksCatHomeTestModal,
} from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import {
  VehicleChecksModalCatHomeTestAnalyticsEffects,
} from './vehicle-checks-modal.cat-home-test.analytics.effects';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';

@NgModule({
  declarations: [
    VehicleChecksCatHomeTestModal,
  ],
  imports: [
    EffectsModule.forFeature([
      VehicleChecksModalCatHomeTestAnalyticsEffects,
    ]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatHomeModule { }

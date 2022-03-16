import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  VehicleChecksCatHomeTestModal,
} from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
// import { VehicleChecksModalCatDAnalyticsEffects } from './vehicle-checks-modal.cat-d.analytics.effects';

@NgModule({
  declarations: [
    VehicleChecksCatHomeTestModal,
  ],
  imports: [
    EffectsModule.forFeature([
      // VehicleChecksModalCatDAnalyticsEffects,
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

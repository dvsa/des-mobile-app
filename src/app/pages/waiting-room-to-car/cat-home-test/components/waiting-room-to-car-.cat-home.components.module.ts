import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  VehicleChecksModalCatHomeModule,
} from
  '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks-modal/vehicle-checks-modal.cat-home.page.module';
import {
  VehicleChecksCatHomeTestComponent,
} from '@pages/waiting-room-to-car/cat-home-test/components/vehicle-checks/vehicle-checks';

@NgModule({
  imports: [
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    VehicleChecksModalCatHomeModule,
  ],
  declarations: [
    VehicleChecksCatHomeTestComponent,
  ],
  exports: [
    VehicleChecksCatHomeTestComponent,
  ],
})
export class WaitingRoomToCarCatHomeComponentsModule { }

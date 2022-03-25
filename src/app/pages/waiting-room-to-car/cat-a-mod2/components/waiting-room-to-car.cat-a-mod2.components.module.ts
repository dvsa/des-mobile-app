import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { CommonModule } from '@angular/common';
import {
  VehicleChecksModalCatAMod2Module,
// eslint-disable-next-line max-len
} from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page.module';
import { VehicleChecksCatAMod2Component } from './vehicle-checks/vehicle-checks';

@NgModule({
  declarations: [
    VehicleChecksCatAMod2Component,
  ],
  imports: [
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    ComponentsModule,
    CommonModule,
    VehicleChecksModalCatAMod2Module,
  ],
  exports: [
    VehicleChecksCatAMod2Component,
  ],
})
export class WaitingRoomToCarCatAMod2ComponentsModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { VehicleChecksModalCatAMod2Module } from './vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page.module';
import { VehicleChecksCatAMod2Component } from './vehicle-checks/vehicle-checks';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [VehicleChecksCatAMod2Component],
  imports: [
    IonicComponentsModule,
    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    VehicleChecksModalCatAMod2Module,
  ],
  exports: [VehicleChecksCatAMod2Component],
})
export class WaitingRoomToCarCatAMod2ComponentsModule {}

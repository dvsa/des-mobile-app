import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { VehicleChecksModalCatAMod2Module } from './vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page.module';
import { VehicleChecksCatAMod2Component } from './vehicle-checks/vehicle-checks';

@NgModule({
	declarations: [VehicleChecksCatAMod2Component],
	imports: [IonicModule, ComponentsModule, CommonModule, ReactiveFormsModule, VehicleChecksModalCatAMod2Module],
	exports: [VehicleChecksCatAMod2Component],
})
export class WaitingRoomToCarCatAMod2ComponentsModule {}

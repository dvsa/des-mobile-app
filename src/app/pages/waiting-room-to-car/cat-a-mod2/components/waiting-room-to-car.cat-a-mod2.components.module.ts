import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { IonButton, IonCol, IonIcon, IonRow } from '@ionic/angular';
import { VehicleChecksModalCatAMod2Module } from './vehicle-checks-modal/vehicle-checks-modal.cat-a-mod2.page.module';
import { VehicleChecksCatAMod2Component } from './vehicle-checks/vehicle-checks';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VehicleChecksModalCatAMod2Module,
    IonButton,
    IonIcon,
    IonCol,
    IonRow,
    VehicleChecksCatAMod2Component,
  ],
  exports: [VehicleChecksCatAMod2Component],
})
export class WaitingRoomToCarCatAMod2 {}

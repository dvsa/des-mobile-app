import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonCol, IonRow, IonSelect, IonSelectOption } from '@ionic/angular';
import { VehicleChecksQuestionCatAMod2Component } from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-question/vehicle-checks-question';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    WaitingRoomToCarComponentsModule,
    IonCol,
    IonRow,
    IonSelect,
    IonSelectOption,
    VehicleChecksQuestionCatAMod2Component,
  ],
  exports: [VehicleChecksQuestionCatAMod2Component],
})
export class VehicleChecksQuestionCatAMod2Module {}

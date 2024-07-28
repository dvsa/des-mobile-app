import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { VehicleChecksQuestionCatAMod2Component } from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-question/vehicle-checks-question';
import { WaitingRoomToCarComponentsModule } from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';

@NgModule({
  declarations: [VehicleChecksQuestionCatAMod2Component],
  imports: [
    IonicModule,
    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    WaitingRoomToCarComponentsModule,
  ],
  exports: [VehicleChecksQuestionCatAMod2Component],
})
export class VehicleChecksQuestionCatAMod2Module {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  VehicleChecksModalCatADIPart2Module,
} from './vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.page.module';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';
import { TrainingRecordsCatAdiPart2Component } from './training-records/training-records.cat-adi-part2';
import { OrditTrainerCatAdiPart2Component } from './ordit-trainer/ordit-trainer.cat-adi-part2';
import {
  TrainerRegistrationNumberCatAdiPart2Component,
} from './trainer-registration-number/trainer-registration-number.cat-adi-part2';

@NgModule({
  declarations: [
    TrainingRecordsCatAdiPart2Component,
    OrditTrainerCatAdiPart2Component,
    TrainerRegistrationNumberCatAdiPart2Component,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    IonicModule,
    DirectivesModule,
    WaitingRoomToCarComponentsModule,
    ReactiveFormsModule,
    VehicleChecksModalCatADIPart2Module,
  ],
  exports: [
    TrainingRecordsCatAdiPart2Component,
    OrditTrainerCatAdiPart2Component,
    TrainerRegistrationNumberCatAdiPart2Component,
  ],
})
export class WaitingRoomToCarCatADIPart2ComponentsModule { }

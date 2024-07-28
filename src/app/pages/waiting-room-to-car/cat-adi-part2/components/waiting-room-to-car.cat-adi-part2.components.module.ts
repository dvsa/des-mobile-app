import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ComponentsModule } from '@components/common/common-components.module';
import { DirectivesModule } from '@directives/directives.module';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';
import { OrditTrainerCatAdiPart2Component } from './ordit-trainer/ordit-trainer.cat-adi-part2';
import { TrainerRegistrationNumberCatAdiPart2Component } from './trainer-registration-number/trainer-registration-number.cat-adi-part2';
import { TrainingRecordsCatAdiPart2Component } from './training-records/training-records.cat-adi-part2';
import { VehicleChecksModalCatADIPart2Module } from './vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.page.module';

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
export class WaitingRoomToCarCatADIPart2ComponentsModule {}

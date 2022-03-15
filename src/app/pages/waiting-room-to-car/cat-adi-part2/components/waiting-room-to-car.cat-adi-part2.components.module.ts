import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { VehicleChecksCatADIPart2Component } from './vehicle-checks/vehicle-checks.cat-adi-part2';
import { DirectivesModule } from '@directives/directives.module';
import { ComponentsModule } from '@components/common/common-components.module';
import { AccompanimentCardCatADIPart2Component }
  from './accompaniment-card/accompaniment-card.cat-adi-part2';
import { WaitingRoomToCarComponentsModule } from '../../components/waiting-room-to-car.components.module';
import { TrainingRecordsCatAdiPart2Component } from './training-records/training-records.cat-adi-part2';
import { OrditTrainerCatAdiPart2Component } from './ordit-trainer/ordit-trainer.cat-adi-part2';
import {
  TrainerRegistrationNumberCatAdiPart2Component,
} from './trainer-registration-number/trainer-registration-number.cat-adi-part2';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    VehicleChecksCatADIPart2Component,
    AccompanimentCardCatADIPart2Component,
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
    ],
  exports: [
    VehicleChecksCatADIPart2Component,
    AccompanimentCardCatADIPart2Component,
    TrainingRecordsCatAdiPart2Component,
    OrditTrainerCatAdiPart2Component,
    TrainerRegistrationNumberCatAdiPart2Component,
  ],
})
export class WaitingRoomToCarCatADIPart2ComponentsModule { }

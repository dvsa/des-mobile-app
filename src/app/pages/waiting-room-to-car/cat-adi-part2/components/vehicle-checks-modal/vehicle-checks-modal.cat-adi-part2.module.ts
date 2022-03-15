import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { VehicleChecksModalCatAdiPart2AnalyticsEffects } from './vehicle-checks-modal.cat-adi-part2.analytics.effects';
import {
  VehicleChecksQuestionComponent,
} from '../vehicle-checks-question/vehicle-checks-question.cat-adi-part2';
import { VehicleChecksCatADIPart2Modal } from './vehicle-checks-modal.cat-adi-part2.page';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';

@NgModule({
  declarations: [
    VehicleChecksCatADIPart2Modal,
    VehicleChecksQuestionComponent,
  ],
  imports: [
    EffectsModule.forFeature([
      VehicleChecksModalCatAdiPart2AnalyticsEffects,
    ]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatADIPart2Module { }

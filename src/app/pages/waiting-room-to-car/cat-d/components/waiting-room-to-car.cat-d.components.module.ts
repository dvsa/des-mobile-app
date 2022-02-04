import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import { SafetyQuestionComponent } from '@pages/waiting-room-to-car/cat-d/components/safety-question/safety-question';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  VehicleChecksModalCatDModule,
} from '@pages/waiting-room-to-car/cat-d/components/vehicle-checks-modal/vehicle-checks-modal.cat-d.page.module';

@NgModule({
  imports: [
    IonicModule,
    ComponentsModule,
    ReactiveFormsModule,
    CommonModule,
    VehicleChecksModalCatDModule,
  ],
})
export class WaitingRoomToCarCatDComponentsModule { }

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';

import { EffectsModule } from '@ngrx/effects';
import { SafetyQuestionComponent } from '@pages/waiting-room-to-car/cat-d/components/safety-question/safety-question';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatDAnalyticsEffects } from './vehicle-checks-modal.cat-d.analytics.effects';
import { VehicleChecksCatDModal } from './vehicle-checks-modal.cat-d.page';

import { IonicComponentsModule } from '@shared/modules/ionic-components.module';
@NgModule({
  declarations: [VehicleChecksCatDModal, SafetyQuestionComponent],
  imports: [
    IonicComponentsModule,
    EffectsModule.forFeature([VehicleChecksModalCatDAnalyticsEffects]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,

    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatDModule {}

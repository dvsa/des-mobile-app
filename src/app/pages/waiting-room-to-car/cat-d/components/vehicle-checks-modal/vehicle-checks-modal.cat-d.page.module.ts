import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { SafetyQuestionComponent } from '@pages/waiting-room-to-car/cat-d/components/safety-question/safety-question';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatDAnalyticsEffects } from './vehicle-checks-modal.cat-d.analytics.effects';
import { VehicleChecksCatDModal } from './vehicle-checks-modal.cat-d.page';

@NgModule({
  declarations: [
    VehicleChecksCatDModal,
    SafetyQuestionComponent,
  ],
  imports: [
    EffectsModule.forFeature([
      VehicleChecksModalCatDAnalyticsEffects,
    ]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatDModule { }

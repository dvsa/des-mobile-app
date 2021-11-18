import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatCAnalyticsEffects } from './vehicle-checks-modal.cat-c.analytics.effects';
import { VehicleChecksQuestionCatCComponent } from '../vehicle-checks-question/vehicle-checks-question.cat-c';
import { VehicleChecksCatCModal } from './vehicle-checks-modal.cat-c.page';

@NgModule({
  declarations: [
    VehicleChecksCatCModal,
    VehicleChecksQuestionCatCComponent,
  ],
  imports: [
    EffectsModule.forFeature([
      VehicleChecksModalCatCAnalyticsEffects,
    ]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
  ],
})
export class VehicleChecksModalCatCModule { }

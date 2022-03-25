import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { ComponentsModule } from '@components/common/common-components.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import {
  VehicleChecksQuestionCatAMod2Component,
} from '@pages/waiting-room-to-car/cat-a-mod2/components/vehicle-checks-question/vehicle-checks-question';
import { VehicleChecksCatAMod2Modal } from './vehicle-checks-modal.cat-a-mod2.page';
import { VehicleChecksModalCatAMod2AnalyticsEffects } from './vehicle-checks-modal.cat-a-mod2.analytics.effects';

@NgModule({
  declarations: [
    VehicleChecksCatAMod2Modal,
    VehicleChecksQuestionCatAMod2Component,
  ],
  imports: [
    EffectsModule.forFeature([
      VehicleChecksModalCatAMod2AnalyticsEffects,
    ]),
    IonicModule,
    ComponentsModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    WaitingRoomToCarComponentsModule,
  ],
})
export class VehicleChecksModalCatAMod2Module {

}

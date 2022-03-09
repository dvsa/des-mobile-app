import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatCAnalyticsEffects } from './vehicle-checks-modal.cat-c.analytics.effects';
import { VehicleChecksCatCModal } from './vehicle-checks-modal.cat-c.page';

@NgModule({
  declarations: [
    VehicleChecksCatCModal,
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
    FormsModule,
  ],
})
export class VehicleChecksModalCatCModule { }

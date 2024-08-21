import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ComponentsModule } from '@components/common/common-components.module';
import { IonicModule } from '@ionic/angular';
import { EffectsModule } from '@ngrx/effects';
import { WaitingRoomToCarComponentsModule } from '../../../components/waiting-room-to-car.components.module';
import { VehicleChecksModalCatCAnalyticsEffects } from './vehicle-checks-modal.cat-c.analytics.effects';
import { VehicleChecksCatCModal } from './vehicle-checks-modal.cat-c.page';

@NgModule({
  declarations: [VehicleChecksCatCModal],
  imports: [
    EffectsModule.forFeature([VehicleChecksModalCatCAnalyticsEffects]),
    ComponentsModule,
    WaitingRoomToCarComponentsModule,
    IonicModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class VehicleChecksModalCatCModule {}

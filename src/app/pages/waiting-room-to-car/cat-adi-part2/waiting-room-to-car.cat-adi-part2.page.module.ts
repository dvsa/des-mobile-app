import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ComponentsModule } from '@components/common/common-components.module';
import {
  WaitingRoomToCarComponentsModule,
} from '@pages/waiting-room-to-car/components/waiting-room-to-car.components.module';
import {
  VehicleChecksModalCatADIPart2Module,
} from
'@pages/waiting-room-to-car/cat-adi-part2/components/vehicle-checks-modal/vehicle-checks-modal.cat-adi-part2.page.module';
import { WaitingRoomToCarCatADIPart2ComponentsModule }
  from './components/waiting-room-to-car.cat-adi-part2.components.module';
import { WaitingRoomToCarAnalyticsEffects } from '../waiting-room-to-car.analytics.effects';
import { WaitingRoomToCarCatADIPart2Page } from './waiting-room-to-car.cat-adi-part2.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VehicleChecksModalCatADIPart2Module,
    WaitingRoomToCarCatADIPart2ComponentsModule,
    ComponentsModule,
    ReactiveFormsModule,
    WaitingRoomToCarComponentsModule,
    EffectsModule.forFeature([
      WaitingRoomToCarAnalyticsEffects,
    ]),
  ],
  declarations: [WaitingRoomToCarCatADIPart2Page],
})
export class WaitingRoomToCarCatADIPart2PageModule {}
